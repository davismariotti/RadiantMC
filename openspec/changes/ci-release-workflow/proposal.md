## Why

RadiantMC is a monorepo with three independently-deployable components (BukkitPlugin, SurvivalAPI, SurvivalConfig) and currently has no CI or release automation at all — no lint/build/test gate on PRs, no versioning, and every deploy is a fully manual build-and-copy. `SurvivalAPI`'s Docker image is 3 years stale in part because there's no low-friction way to cut a new one. This change adds path-filtered CI checks and independent semantic-release pipelines per component, modeled on the patterns already proven in `BikeDifference` and `CampFinder` (CampAlert).

## What Changes

- Add `.github/workflows/ci.yml`: path-filtered jobs that build/check each component on push/PR to `main` — `mvn package` for BukkitPlugin, a Python import/syntax check for SurvivalAPI, `npm run build` + `npm test` for SurvivalConfig. Each job runs its component's test step unconditionally so newly-added tests execute automatically; today that step passes vacuously since none of the three have real tests.
- Add `.github/workflows/release-bukkitplugin.yml`: on push to `main` touching `BukkitPlugin/**`, runs semantic-release (tag prefix `bukkitplugin-v*`) against commits scoped to that path, builds the shaded jar via `mvn package`, and attaches `RadiantMCPlugin.jar` to the GitHub release. No automated deploy to the MC server — manual install.
- Add `.github/workflows/release-survivalapi.yml`: on push to `main` touching `SurvivalAPI/**`, runs semantic-release (tag prefix `survivalapi-v*`), builds and pushes `davismariotti/survivalapi` to Docker Hub tagged with the release version and `latest`.
- Add `.github/workflows/release-survivalconfig.yml`: on push to `main` touching `SurvivalConfig/**`, runs semantic-release (tag prefix `survivalconfig-v*`), runs `npm run build`, zips `build/`, and attaches it to the GitHub release as a downloadable asset (pattern from `BikeDifference`/`CampFinder`).
- Add three `.releaserc.json` configs (one per component, each restricted to its own path via `monorepo`-style tag/commit scoping) plus per-component `CHANGELOG` handling via `@semantic-release/github`.
- Add `SurvivalAPI/docker/deploy.sh`: pulls the latest `davismariotti/survivalapi` image from Docker Hub and restarts the container on the droplet (`docker compose` in `SurvivalAPI/`), mirroring `CampFinder/docker/deploy.sh`.
- Add `SurvivalConfig/scripts/deploy.sh`: downloads the latest `survivalconfig-v*` release's zipped build asset via `gh release download` and installs it to `/home/davis/RadiantMC/SurvivalConfig/build` (the path nginx already serves for `survivalconfig.davismariotti.com`), mirroring `BikeDifference/scripts/deploy.sh`.
- No deploy script for BukkitPlugin — it has no automated deploy target today and installing a plugin jar into a live Minecraft server isn't something to automate blindly.

## Capabilities

### New Capabilities
- `monorepo-ci`: path-filtered continuous integration that builds/tests each of the three components independently on push and PR.
- `component-release`: independent semantic-versioned release pipelines per component (BukkitPlugin, SurvivalAPI, SurvivalConfig), each producing a tagged GitHub release with the appropriate artifact (jar, Docker image, zipped static build).
- `component-deploy`: manual-trigger deploy scripts for SurvivalAPI and SurvivalConfig that pull the latest release and install it on the droplet described in the server manifest.

### Modified Capabilities
(none — no existing specs in this repo)

## Impact

- **Affected code**: new `.github/workflows/*.yml`, three `.releaserc.json` files, `SurvivalAPI/docker/deploy.sh`, `SurvivalConfig/scripts/deploy.sh`.
- **Dependencies**: requires `DOCKERHUB_USERNAME`/`DOCKERHUB_TOKEN` repo secrets for the SurvivalAPI image push; relies on `GITHUB_TOKEN` (default) for releases.
- **Systems**: Docker Hub (`davismariotti/survivalapi`), GitHub Releases, the droplet at `206.189.78.26` (deploy scripts run there manually, same as `CampAlert`/`BikeDifference` today — not wired into CI itself).
- **No breaking changes** — this repo has no prior CI/release automation to disrupt.
