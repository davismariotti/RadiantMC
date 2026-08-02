## Context

RadiantMC is a monorepo containing three unrelated deployables that share nothing but the repo:

- `BukkitPlugin/` — Maven, Java 17, builds a shaded jar (`RadiantMCPlugin.jar`) via `maven-assembly-plugin`. No test sources. No current deploy path.
- `SurvivalAPI/` — Flask (Python 3.9), built into a Docker image (`davismariotti/survivalapi`), currently at a 3-year-stale tag `1.1`, deployed to the droplet via `docker-compose.yml` with `network_mode: host`, served at `survivalapi.davismariotti.com`. No tests.
- `SurvivalConfig/` — Create React App (CRA, react-scripts 5), static build served at `survivalconfig.davismariotti.com` from `/home/davis/RadiantMC/SurvivalConfig/build` per the server manifest. Has one default CRA test (`App.test.js`).

Two sibling repos already establish the patterns to reuse:
- `BikeDifference` (single-artifact static site): `ci.yml` (lint/typecheck/test) + `release.yml` (semantic-release dry-run gate → build → attach zipped/renamed asset to GH release) + `scripts/deploy.sh` (`gh release download` latest → copy into nginx web root).
- `CampFinder`/CampAlert (monorepo, single shared version): path-filtered `ci.yml` jobs via `dorny/paths-filter`, and a `release.yml` that gates on `cycjimmy/semantic-release-action` dry-run, then fans out to parallel build jobs (Docker image, migrate image, frontend zip) that only run `if: needs.release-check.outputs.new-release-published == 'true'`, then a final `release` job that publishes and uploads artifacts. Deploy script (`docker/deploy.sh`) pulls the image and does a `docker rollout` on the droplet, run manually.

Unlike CampFinder, RadiantMC's three components don't share a release cadence or even a consumer — a SurvivalAPI bugfix shouldn't cut a BukkitPlugin release. Per user decision, each component gets independent versioning via its own semantic-release config and tag prefix, gated on path filters, mirroring how `paths:` already scopes `BikeDifference/release.yml` to relevant file changes.

## Goals / Non-Goals

**Goals:**
- One shared CI workflow that only runs a component's build/test job when that component's paths changed (or on manual dispatch), consistent with `CampFinder/.github/workflows/ci.yml`'s `dorny/paths-filter` pattern.
- Three independent release pipelines, each with its own semantic-release config/tag prefix (`bukkitplugin-v*`, `survivalapi-v*`, `survivalconfig-v*`), each triggered only by pushes touching its own path.
- SurvivalAPI release pushes `davismariotti/survivalapi:<version>` and `:latest` to Docker Hub.
- SurvivalConfig release attaches a zipped production build to its GitHub release; a deploy script installs it to the exact path nginx already serves (`/home/davis/RadiantMC/SurvivalConfig/build`).
- BukkitPlugin release attaches `RadiantMCPlugin.jar` to its GitHub release; no auto-deploy.
- A `deploy.sh` for SurvivalAPI that pulls the new image and restarts the container on the droplet, run manually by the user (not wired into CI), matching `CampFinder/docker/deploy.sh`'s manual-trigger model.
- CI test steps run unconditionally per component so that if/when real tests are added, they execute and gate merges — matches the user's explicit ask, even though all three currently have zero or trivial tests.

**Non-Goals:**
- No BukkitPlugin auto-deploy to the live Minecraft server (no established path in the server manifest, and blindly hot-swapping a plugin jar into a running MC server is out of scope).
- No CI/CD trigger of the deploy scripts themselves (no SSH secrets are being added to GitHub Actions in this change) — deploys stay a manual `ssh` + script run, consistent with how CampAlert and BikeDifference are deployed today per the server manifest.
- No new test suites are being written for any component — CI enforces whatever tests exist today (effectively none for BukkitPlugin/SurvivalAPI, one trivial test for SurvivalConfig).
- No changes to nginx config, Cloudflare, or DNS — deploy scripts target the existing paths/ports documented in the server manifest.

## Decisions

**Independent per-component semantic-release, not a shared version.**
Each component gets its own `.releaserc.json` (`BukkitPlugin/.releaserc.json`, `SurvivalAPI/.releaserc.json`, `SurvivalConfig/.releaserc.json`) with `tagFormat` set to `<component>-v${version}` and `@semantic-release/commit-analyzer`'s scope-aware config isn't used — instead, the release-check job for each workflow is gated by GitHub Actions `paths:` filters, so a workflow only runs (and thus only ever proposes a release) when commits touch that component's directory. This is simpler than teaching semantic-release to scope by conventional-commit `scope:` and matches how `BikeDifference` already scopes its single release via `paths:`.

Alternative considered: a single monorepo version (CampFinder's model). Rejected per user's explicit choice — the three components have no shared consumer or release cadence, and bumping SurvivalConfig's version on a BukkitPlugin-only change would be noise.

**Reuse the `cycjimmy/semantic-release-action` dry-run-then-release two-phase pattern from both example repos**, including the open-PR prerelease channel logic (`branches-config` step) — this is a proven pattern in this user's other repos and requires no adaptation beyond pointing `paths:` at each component's directory.

**CI uses `dorny/paths-filter` (as CampFinder does) rather than three fully separate `ci.yml` files** — one workflow file, filtered jobs, so a PR touching multiple components runs multiple jobs in one check run rather than three separate workflow runs cluttering the PR checks list.

**SurvivalAPI CI "build" step**: no compiled artifact exists for a Flask app, so CI's build-equivalent is `python -m py_compile` across `src/` (byte-compiles every module, catching syntax errors) plus `pip install -r requirements.txt` to catch dependency resolution failures — cheapest meaningful gate without introducing a linter choice unprompted. Test step runs `pytest` unconditionally (`continue-on-error: false`); with zero test files today `pytest` exits 5 ("no tests collected") which would fail the gate, so the step is `pytest --no-header -ra || [ $? -eq 5 ]` style handling isn't needed if we instead let CI treat "no tests" as trivially passing — handled by adding a placeholder-free `pytest` invocation only once a `tests/` dir exists; until then the CI job's test step is a no-op guarded by `if: hashFiles('SurvivalAPI/tests/**') != ''`. This satisfies "should run if tests are added" without hand-rolling exit-code suppression.

**SurvivalConfig CI**: `npm run build` (compile-equivalent) + `npm test -- --watchAll=false` (CRA's Jest runner; the existing `App.test.js` will run and pass, and any future test file under `src/` is picked up automatically since CRA globs `*.test.js`).

**BukkitPlugin CI**: `mvn -B compile` (compile-equivalent) + `mvn -B test` (Maven runs Surefire even with zero test classes — this exits 0 with "No tests to run" rather than failing, so no special-casing needed here, unlike pytest).

**Deploy scripts stay manual, not wired to CI**, matching the existing pattern for CampAlert/BikeDifference (their deploy.sh files are run by hand on the droplet, not via `ssh`-in-CI). No new deploy secrets are introduced.

## Risks / Trade-offs

- **Three `.releaserc.json` + three release workflows is more files than a single shared config** → Mitigation: the duplication is shallow (each is ~15 lines, differing only in `tagFormat` and paths); a future consolidation into a reusable workflow (`workflow_call`) is possible but not justified for 3 components today.
- **`pytest` with zero collected tests exits non-zero by default** → Mitigation: guard the test step with `if: hashFiles('SurvivalAPI/tests/**') != ''` so it's skipped (not failed) until tests exist, satisfying "pass for now, run automatically once added."
- **SurvivalAPI has no existing Docker Hub multi-arch build config** (current `1.1` tag is presumably amd64-only, built manually) → Mitigation: follow CampFinder's `docker/setup-qemu-action` + `buildx` pattern for `linux/amd64,linux/arm64` to future-proof, at the cost of slightly longer CI (QEMU emulation for arm64 on a Flask app is not performance-critical since this isn't the deploy path, just the build).
- **Docker Hub credentials required** (`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`) but not yet present as repo secrets → Mitigation: call out explicitly in tasks.md as a manual setup step before the SurvivalAPI release workflow can succeed; `dry_run` input (default `true`, matching both example repos) lets the workflow be validated before secrets are added.
- **`SurvivalConfig`'s deploy target (`/home/davis/RadiantMC/SurvivalConfig/build`) is a raw path, not `/var/www/...`** — differs from every other deploy script's convention → Mitigation: `deploy.sh` hardcodes exactly this path (matching the current nginx vhost config per the server manifest) rather than assuming a `/var/www` convention.

## Migration Plan

1. Add `.releaserc.json` × 3 and workflow files; open as a PR with `workflow_dispatch: dry_run: true` default so nothing releases until manually triggered with `dry_run: false` or merged to `main`.
2. Manually add `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` repo secrets before the first non-dry-run SurvivalAPI release.
3. First release of each component will be `v1.0.0` (or whatever semantic-release computes from history — likely `1.0.0` since there's no prior `<component>-v*` tag) — confirm this is acceptable versioning even though BukkitPlugin's `pom.xml` already says `1.5` (these are decoupled; the Maven `<version>` isn't read by CI and can be left as-is or updated separately).
4. No rollback concerns — this only adds new workflows; nothing existing is modified or removed.

## Open Questions

- None outstanding — all prior open questions (versioning strategy, BukkitPlugin deploy, SurvivalAPI deploy, CI test strictness) were resolved via user Q&A before this design was written.
