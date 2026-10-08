---
'@drizztdourden08/brock-build': patch
---

An app whose main process and renderer sit in two folders (Relic of the Past: `apps/desktop/electron` and `apps/web/src`) moves them into one app folder; Brock adds no setting for other `electron` or `src` paths, since every scanner, managed config and check reads them beside `brock.config.ts`. docs/upgrading-an-app.md gives the move step by step: the aliases other than `@app` out first, the renderer into the folder that holds `electron/`, the paths that named the old places, the Brock skeleton created beside the app and merged in, and the old web folder and root Vite config removed.
