---
'@drizztdourden08/brock-build': minor
---

When `workflows.publish` is set, `brock sync` also writes a managed `publish-packages.yml` that publishes the listed packages on `workflow_dispatch`, with an optional `packages` input for a comma-separated subset. It shares its steps with the `publish-packages` job of `release.yml`, needs no app build job, and refuses a folder that is not in `workflows.publish`. `brock check` compares the new file, and an app without `workflows.publish` gets no file.
