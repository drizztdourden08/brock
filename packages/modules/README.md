<!-- @layer docs @kind doc -->
# Brock modules

Optional modules live here, one package each: `updater`, `secrets`, `input`, `display`, `port-kit`. Each carries a `package.json#brock` manifest and is installed into an app with `brock add <id>`. The workspace glob `packages/modules/*` points here.

`input` loads a native SDL3 addon at runtime. The addon is found on disk and never bundled, so a blank app carries no SDL3 at all.
