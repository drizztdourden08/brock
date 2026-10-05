---
'@drizztdourden08/brock-thread': patch
---

In a monorepo upgrade the gate skips an app's own script when the root script of the same name already runs it in every package (`pnpm -r <script>` with no `--filter`), so lint no longer runs twice.
