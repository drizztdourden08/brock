---
'@drizztdourden08/brock-tools': minor
---

A tool installed while the app runs is found. `getTools` reads the PATH on each lookup (at most every 2 s): on Windows the process PATH merged with the saved machine and user PATH from the registry, elsewhere the process PATH. `ToolsEnv.pathEnv` takes a string or a function. Main sends `tools:changed` after an install (`window.api.tools.onChanged`), and `useTool(id, { refreshOnFocus? })` locates the tool again on that event and whenever the window gets focus (on by default), beside its `refresh()`.
