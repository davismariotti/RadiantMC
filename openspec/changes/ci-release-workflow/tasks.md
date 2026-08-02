## 1. CI workflow

- [x] 1.1 Create `.github/workflows/ci.yml` with a `changes` job using `dorny/paths-filter` to detect changes under `BukkitPlugin/**`, `SurvivalAPI/**`, `SurvivalConfig/**`
- [x] 1.2 Add `bukkitplugin-ci` job (path-gated + `workflow_dispatch`): `actions/setup-java@v4` (17, temurin), `mvn -B compile`, `mvn -B test`
- [x] 1.3 Add `survivalapi-ci` job (path-gated + `workflow_dispatch`): `actions/setup-python@v5` (3.9), `pip install -r SurvivalAPI/requirements.txt`, `python -m py_compile SurvivalAPI/src/*.py`, test step guarded by `if: hashFiles('SurvivalAPI/tests/**') != ''` running `pytest`
- [x] 1.4 Add `survivalconfig-ci` job (path-gated + `workflow_dispatch`): `actions/setup-node@v4` (SurvivalConfig uses Yarn, not npm — `yarn install --frozen-lockfile`, `yarn build`, `yarn test --watchAll=false`)
- [x] 1.5 Add a final `ci` gate job that depends on all three and fails if any failed/cancelled, matching `CampFinder/.github/workflows/ci.yml`'s pattern

## 2. BukkitPlugin release

- [x] 2.1 Create `BukkitPlugin/.releaserc.json` with `tagFormat: "bukkitplugin-v${version}"` and the standard commit-analyzer/release-notes-generator/github plugin set
- [x] 2.2 Create `.github/workflows/release-bukkitplugin.yml`: trigger on push to `master` (repo's default branch) with `paths: ['BukkitPlugin/**']` plus `workflow_dispatch` (`dry_run` input, default `true`)
- [x] 2.3 Add `release-check` job (semantic-release dry-run against `BukkitPlugin/.releaserc.json`, open-PR prerelease channel detection) mirroring `BikeDifference/.github/workflows/release.yml`
- [x] 2.4 Add `build-jar` job (gated on `new-release-published`): `mvn package`, upload `RadiantMCPlugin.jar` as a workflow artifact
- [x] 2.5 Add `release` job (gated on publish + not dry-run): run semantic-release for real, download the jar artifact, `gh release upload` it to the new tag

## 3. SurvivalAPI release

- [x] 3.1 Create `SurvivalAPI/.releaserc.json` with `tagFormat: "survivalapi-v${version}"`
- [x] 3.2 Create `.github/workflows/release-survivalapi.yml`: trigger on push to `master` with `paths: ['SurvivalAPI/**']` plus `workflow_dispatch` (`dry_run` input, default `true`)
- [x] 3.3 Add `release-check` job (semantic-release dry-run against `SurvivalAPI/.releaserc.json`)
- [x] 3.4 Add `build-and-push-docker` job (gated on publish): `docker/setup-qemu-action`, `docker/setup-buildx-action`, conditional `docker/login-action` (skip on dry-run), `docker/metadata-action` for `davismariotti/survivalapi` tags (`<version>`, `latest`), `docker/build-push-action` for `linux/amd64,linux/arm64` with `push: ${{ inputs.dry_run != true }}`
- [x] 3.5 Add `release` job (gated on publish + not dry-run): run semantic-release for real to publish the GitHub release/tag
- [x] 3.6 `DOCKERHUB_USERNAME`/`DOCKERHUB_TOKEN` repo secrets already added by the user before this PR

## 4. SurvivalConfig release

- [x] 4.1 Create `SurvivalConfig/.releaserc.json` with `tagFormat: "survivalconfig-v${version}"`
- [x] 4.2 Create `.github/workflows/release-survivalconfig.yml`: trigger on push to `master` with `paths: ['SurvivalConfig/**']` plus `workflow_dispatch` (`dry_run` input, default `true`)
- [x] 4.3 Add `release-check` job (semantic-release dry-run against `SurvivalConfig/.releaserc.json`)
- [x] 4.4 Add `build-frontend` job (gated on publish): `yarn install --frozen-lockfile` (Yarn, not npm), `yarn build`, zip `SurvivalConfig/build/`, upload as workflow artifact
- [x] 4.5 Add `release` job (gated on publish + not dry-run): run semantic-release for real, download the build zip artifact, `gh release upload` it to the new tag

## 5. Deploy scripts

- [x] 5.1 Create `SurvivalAPI/docker/deploy.sh`: `docker pull davismariotti/survivalapi:latest`, restart the `SurvivalAPI` container via `docker compose -f SurvivalAPI/docker-compose.yml up -d`, following `CampFinder/docker/deploy.sh`'s structure (usage comment, `set -e`, script-relative paths)
- [x] 5.2 Create `SurvivalConfig/scripts/deploy.sh`: `gh release list`/`gh release download` the latest `survivalconfig-v*` tag's build zip, extract into `/home/davis/RadiantMC/SurvivalConfig/build`, following `BikeDifference/scripts/deploy.sh`'s structure
- [x] 5.3 `chmod +x` both scripts

## 6. Verification

- [ ] 6.1 Push a branch touching only `SurvivalConfig/**` and confirm via a draft PR that only the SurvivalConfig CI job runs (not BukkitPlugin/SurvivalAPI)
- [ ] 6.2 Manually dispatch each release workflow with `dry_run: true` and confirm the dry-run gate and build steps succeed without pushing/publishing anything
- [ ] 6.3 Add `DOCKERHUB_USERNAME`/`DOCKERHUB_TOKEN` repo secrets, then dispatch the SurvivalAPI release workflow with `dry_run: false` on a throwaway change to confirm the image pushes to Docker Hub
- [ ] 6.4 Confirm `BukkitPlugin`'s Maven `test` phase passes with zero test classes present (no special-casing needed, unlike SurvivalAPI's pytest)
