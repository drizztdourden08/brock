---
"@drizztdourden08/brock-input": minor
---

The main side takes a narrowed context, InputMainContext: handle, emit, files, paths, log, product and the two flags isHeadlessLaunch and hasFlag. A host that builds its own Electron main can call getInput and inputMain.register without a cast.
