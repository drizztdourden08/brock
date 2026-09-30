<!-- @layer docs @kind doc -->
# Breaking changes

A breaking change is any change that makes an app fail after `<app> upgrade` unless its own files change. A removed prop, a renamed export, a moved file and a new required config field all count.

No breaking change merges without two things.

1. A changeset marked breaking. Its summary starts with `Breaking:`, says what apps must change and names the migration id.
2. Its migration, keyed by the version the change ships in. The next version is the one the pending changesets will publish.

## Writing the migration

- brock-build keeps its migrations in `packages/build/migrations/<version>/<id>.mjs`. A module lists its own in its manifest under `brock.migrations`, and its `files` must ship them.
- The file exports `migration`: `{ id, summary, files, apply }`. See the brock-build README for the contract.
- It is idempotent. A second run changes nothing.
- It edits only what it can edit safely. Anything else becomes a to-do with a line number and the exact change to make.
- It has a test in `packages/build/tests` that runs it over a sample app: the file it fixes, the to-dos it leaves and a second run that changes nothing.

## How it is proven

The `upgrade` job in `.github/workflows/ci.yml` scaffolds an app with the last published `create-brock`, upgrades it to this checkout with `upgrade --local` and requires the gate and the headless review to pass. A breaking change without its migration fails that job.

Example: `BrockApp` stopped taking `logoSrc` in 0.1.1. The changeset reads `Breaking: BrockApp no longer takes logoSrc; migration brock-app-logo-src moves apps to product.logos`, and `migrations/0.1.1/brock-app-logo-src.mjs` removes the default prop and leaves a to-do for any other value.
