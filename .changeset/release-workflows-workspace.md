---
'@drizztdourden08/brock-build': minor
---

The managed workflows cover a repo with several packages. In a repo with `brock.workspace.mjs`, `brock sync` in the first app under `apps/` writes `ci.yml` and `release.yml` at the repo root with `APP_DIR` set to that app, and `brock check` fails when they drift; CI runs the lint, markdown, structure and test scripts and `brock check` at the repo root. `release.yml` refuses `prerelease` with `set_latest`, makes a release full on its own while the repo has no latest release (the first one, pre-release or not), never marks a pre-release latest, and on a pre-release links the pre-release's own Windows setup when it was built in place of the small installer, which always installs the latest stable release. The workflows install with `secrets.PACKAGES_TOKEN` when the repo sets it, else the workflow token.
