## ADDED Requirements

### Requirement: SurvivalAPI manual deploy script
The repository SHALL provide `SurvivalAPI/docker/deploy.sh`, run manually on the droplet, that pulls the latest `davismariotti/survivalapi:latest` image from Docker Hub and restarts the running container so the new image takes effect.

#### Scenario: Operator runs the deploy script after a release
- **WHEN** the operator runs `SurvivalAPI/docker/deploy.sh` on the droplet after a new SurvivalAPI release has been pushed to Docker Hub
- **THEN** the script pulls `davismariotti/survivalapi:latest` and restarts the `SurvivalAPI` container so it serves the new image

### Requirement: SurvivalConfig manual deploy script
The repository SHALL provide `SurvivalConfig/scripts/deploy.sh`, run manually on the droplet, that downloads the latest `survivalconfig-v*` GitHub release's zipped build asset and installs it to `/home/davis/RadiantMC/SurvivalConfig/build`, the path already served by the `survivalconfig.davismariotti.com` nginx vhost.

#### Scenario: Operator runs the deploy script after a release
- **WHEN** the operator runs `SurvivalConfig/scripts/deploy.sh` on the droplet after a new SurvivalConfig release is published
- **THEN** the script downloads the latest `survivalconfig-v*` release's build zip and extracts it into `/home/davis/RadiantMC/SurvivalConfig/build`, replacing the previous contents

### Requirement: No CI-triggered deploys
Neither deploy script SHALL be invoked automatically by any GitHub Actions workflow. Deploys remain a manual, operator-triggered action on the droplet.

#### Scenario: Release workflow completes
- **WHEN** a SurvivalAPI or SurvivalConfig release workflow finishes publishing a release
- **THEN** no SSH connection to the droplet is made and no deploy script is executed as part of that workflow
