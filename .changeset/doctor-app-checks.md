---
'@drizztdourden08/brock-build': minor
---

`brock doctor` now checks the app and the machine, so it is the one command for an app that will not start. After the machine checks it prints one line per check, `ok` or `problem` with the exact fix. Versions: every Brock and Tessera package resolves to an installed version that fits its declared range, and the brock packages share one release line. Links: `link:` and `file:` dependencies and pnpm overrides point to folders or files that exist. Generated files: files that differ from what `brock sync` would write are listed, with `brock sync` as the fix. Imports: packages the source imports that `package.json` does not declare are listed with the `pnpm add` command. The command exits 1 on any problem. `brock doctor <platform>` still checks the machine alone.
