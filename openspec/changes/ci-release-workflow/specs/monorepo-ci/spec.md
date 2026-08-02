## ADDED Requirements

### Requirement: Path-filtered CI jobs per component
The system SHALL run a single `ci.yml` GitHub Actions workflow on push and pull_request to `main`, with one job group per component (BukkitPlugin, SurvivalAPI, SurvivalConfig), each gated by a path filter so it only runs when files under that component's directory changed, or when the workflow is manually dispatched.

#### Scenario: PR touches only SurvivalConfig
- **WHEN** a pull request changes files only under `SurvivalConfig/**`
- **THEN** only the SurvivalConfig CI jobs run; BukkitPlugin and SurvivalAPI jobs are skipped

#### Scenario: PR touches multiple components
- **WHEN** a pull request changes files under both `BukkitPlugin/**` and `SurvivalAPI/**`
- **THEN** both components' CI jobs run within the same workflow run

#### Scenario: Manual dispatch
- **WHEN** the workflow is triggered via `workflow_dispatch`
- **THEN** all three components' CI jobs run regardless of changed paths

### Requirement: Per-component build verification
Each component's CI job SHALL verify the component builds successfully using its native toolchain: `mvn -B compile` for BukkitPlugin, dependency install plus `python -m py_compile` across `SurvivalAPI/src` for SurvivalAPI, and `npm run build` for SurvivalConfig.

#### Scenario: BukkitPlugin fails to compile
- **WHEN** a change under `BukkitPlugin/**` introduces a Java compile error
- **THEN** the BukkitPlugin CI job fails and blocks the PR check

#### Scenario: SurvivalConfig build succeeds
- **WHEN** a change under `SurvivalConfig/**` is valid TypeScript/JS
- **THEN** `npm run build` completes successfully and the CI job passes

### Requirement: Per-component test execution
Each component's CI job SHALL run that component's test suite if one exists, and SHALL NOT fail merely because no tests exist yet. Once tests are added to a component, CI SHALL execute them and fail the job on test failure.

#### Scenario: SurvivalAPI has no tests today
- **WHEN** the SurvivalAPI CI job runs and `SurvivalAPI/tests/**` does not exist
- **THEN** the test step is skipped and the job does not fail solely due to absence of tests

#### Scenario: SurvivalAPI gains a test suite
- **WHEN** a `SurvivalAPI/tests/` directory containing `pytest` tests is added and one test fails
- **THEN** the SurvivalAPI CI job's test step runs `pytest` and fails the job

#### Scenario: BukkitPlugin has no test sources today
- **WHEN** the BukkitPlugin CI job runs `mvn -B test` with zero test classes present
- **THEN** Maven Surefire reports no tests to run and the job passes

#### Scenario: SurvivalConfig runs its existing test
- **WHEN** the SurvivalConfig CI job runs
- **THEN** `npm test -- --watchAll=false` executes `App.test.js` and any other `*.test.js` files under `src/`, failing the job if any fail
