---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-core': minor
---

`workflows.attest` takes `perFile: true`, and `BrockWorkflowOptions` now types `attest` and `publish`. With `perFile`, each matched file gets its own attestation, so its `<file>.sigstore.json` has exactly one subject. The action cannot loop and the globs are only known at run time, so sync writes a shell step that expands `paths` and 16 `actions/attest-build-provenance` steps, one per file slot, that skip when empty; the step fails when no file matches or more than 16 do. Without `perFile` nothing changes.
