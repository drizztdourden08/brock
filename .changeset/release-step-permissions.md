---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-core': minor
---

A release step can declare `permissions`, and `workflows.attest` attests release files. A step under `workflows.steps.release.*` takes `permissions` (GitHub permission names with `read`, `write` or `none`) and an `id`; `brock sync` lifts the permissions onto each job that runs the step, merged with the workflow's own, where write wins, and fails on a name or level it does not know. `workflows.attest: { paths, stage }` (`beforePackage` or `afterPackage`) adds `actions/attest-build-provenance`, pinned to a full commit SHA, to the `build-linux` job of the managed `release.yml`, writes each Sigstore bundle beside its file as `<file>.sigstore.json`, and lifts `id-token: write` and `attestations: write` onto that job. An app attests its release files without owning the workflow.
