<!-- @layer docs @kind doc -->
# Changesets

Every change that should reach a published package carries a changeset: `pnpm changeset`, pick the packages, pick the bump, write one plain sentence. All Brock packages share one version (the `fixed` group in `config.json`), so a single bump moves them together.

On `main`, the release workflow opens a version pull request from the pending changesets; merging it publishes every package to GitHub Packages.

A breaking change also needs its migration and a summary that starts with `Breaking:`. See `docs/contributing/breaking-changes.md`.
