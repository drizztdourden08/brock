---
"@drizztdourden08/brock-thread": minor
---

The local CI now runs the same steps as the GitHub workflow. `brock ci` reads the repo's `.github/workflows/ci.yml` (`--workflow <file>` picks another) and runs every job: `run:` steps in order with their env, working directory and shell (Git Bash, pwsh, cmd), `needs:` order, `if:` on `github.event_name` from `--trigger`, and the matrix entries that match this machine. The common actions are mapped (checkout, setup-node, pnpm/action-setup and cache are no-ops; upload-artifact copies its files beside the record), secrets are empty and a pnpm install is the offline one. Anything the runner cannot do is recorded `skipped-local` with the reason. Each record step is named `<job> / <step>` and carries a `job` field; `publish.requiredChecks` matches a job or a step name. Repos without a workflow keep the `gate.scripts` path. The package now depends on `yaml`.
