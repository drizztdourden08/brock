---
'@drizztdourden08/brock-electron': minor
---

Main code can now grant a temp folder the app made itself. `ctx.documents.createTempFolder(prefix?)` makes a fresh folder under the system temp folder (`fs.mkdtemp`, prefix a plain name, default `brock-`) and answers its real path. `ctx.documents.allowFolder` still refuses everything under AppData, Library, .config, .local, .cache, Program Files and the rest, with one exception: a folder that is, or sits inside, a folder `createTempFolder` made in this session. The test uses the real path, so a link out of a made folder is judged by where it points. Nothing else becomes grantable, there is no flag or environment variable, and the list is held in memory only, so a new session starts empty. `ctx.documents.forgetTempFolders()` empties it. The renderer cannot call either one.
