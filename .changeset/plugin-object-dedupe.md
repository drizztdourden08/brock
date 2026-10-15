---
'@drizztdourden08/brock-thread': patch
---

A plugin that `brock.workspace.mjs` lists as an object (the imported `definePlugin` result) now loads once: discovery skips a declared `brock-plugin-*` package or a dot-folder plugin whose name matches a plugin already loaded, so its verbs and workflow steps are no longer counted twice.
