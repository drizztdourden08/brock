---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

`documents.reveal(path)` in the renderer and `ctx.documents.reveal(path)` in main show a file or folder in the system file manager with `shell.showItemInFolder`, only for a path the documents port can already read, and answer `{ revealed, reason? }` over the new `document:reveal` channel. Built-in chords now yield to app commands: when an app, module or runtime command has the same default chord, the Brock command drops it and no conflict is reported. `brock.fullscreen` is now bound to F11 and Alt+Enter, so an app can take Alt+Enter for Properties with no override.
