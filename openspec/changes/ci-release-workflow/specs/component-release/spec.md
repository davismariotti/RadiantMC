## ADDED Requirements

### Requirement: Independent semantic-versioned releases per component
The system SHALL maintain a separate semantic-release configuration and git tag prefix per component — `bukkitplugin-v*` for BukkitPlugin, `survivalapi-v*` for SurvivalAPI, `survivalconfig-v*` for SurvivalConfig — such that a version bump and release for one component is never triggered by changes confined to another component's directory.

#### Scenario: Change confined to BukkitPlugin
- **WHEN** a commit lands on `main` touching only `BukkitPlugin/**`
- **THEN** only the BukkitPlugin release workflow evaluates and potentially publishes a `bukkitplugin-v*` tag; SurvivalAPI and SurvivalConfig releases are not triggered

#### Scenario: Dry-run gate before publishing
- **WHEN** a release workflow runs (push to `main` or manual dispatch)
- **THEN** it first performs a semantic-release dry-run to determine whether a new release is warranted, and only proceeds to build/publish if `new_release_published` is true and the run is not a dry-run-only manual dispatch

### Requirement: BukkitPlugin release artifact
On a qualifying release, the BukkitPlugin release workflow SHALL build the shaded jar via `mvn package` and attach it as `RadiantMCPlugin.jar` to the corresponding GitHub release. It SHALL NOT deploy the jar to any Minecraft server.

#### Scenario: BukkitPlugin release published
- **WHEN** semantic-release determines a new BukkitPlugin release is warranted and publishes tag `bukkitplugin-vX.Y.Z`
- **THEN** `RadiantMCPlugin.jar` is attached to the GitHub release for that tag, and no deploy step runs

### Requirement: SurvivalAPI release artifact
On a qualifying release, the SurvivalAPI release workflow SHALL build a Docker image from `SurvivalAPI/Dockerfile` and push it to Docker Hub as `davismariotti/survivalapi` tagged with both the release version and `latest`.

#### Scenario: SurvivalAPI release published
- **WHEN** semantic-release determines a new SurvivalAPI release is warranted and publishes tag `survivalapi-vX.Y.Z`
- **THEN** `davismariotti/survivalapi:X.Y.Z` and `davismariotti/survivalapi:latest` are pushed to Docker Hub

#### Scenario: Dry-run does not push
- **WHEN** the SurvivalAPI release workflow runs with `dry_run: true` (the default for manual dispatch)
- **THEN** the Docker image is built but not pushed to Docker Hub, and no GitHub release is published

### Requirement: SurvivalConfig release artifact
On a qualifying release, the SurvivalConfig release workflow SHALL run `npm run build`, zip the resulting `build/` directory, and attach it to the corresponding GitHub release.

#### Scenario: SurvivalConfig release published
- **WHEN** semantic-release determines a new SurvivalConfig release is warranted and publishes tag `survivalconfig-vX.Y.Z`
- **THEN** a zip of the production build is attached to the GitHub release for that tag
