---
'@drizztdourden08/brock-build': patch
---

Give the server and helper bundles a working `__dirname`, `__filename` and `require.resolve` for inlined CommonJS packages. A package such as ssh2 that reads `__dirname` at top level no longer dies at start with `ReferenceError: __dirname is not defined in ES module scope`. The bundle defines them under private names in an output banner and `define` maps the free identifiers to those names, so a bundled module that declares its own `__dirname` is not touched. `__dirname` is the folder of the bundle, `dist/server` or `dist/helpers`. A helper bundle now starts with that banner, so its bytes change.
