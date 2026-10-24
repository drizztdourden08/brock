---
'@drizztdourden08/brock-build': patch
---

The app commands of the `brock` CLI (`dev`, `build`, `package`, `icons`, `start`, `add`, `platform`, `web`, `server`) work from any folder inside the repo. They use the nearest folder above the current one that holds `brock.config.ts`, else the only app of the workspace, and run from that folder. With several apps they take `--app <dir>`, or stop and list the apps. A build run from the repo root no longer fails to find the app. ensure-electron no longer runs `pnpm install --force` or deletes `node_modules/electron`: it re-runs the package install script, and when the binary is still missing it exits 1 and prints `pnpm install` for the repo root.
