---
'@drizztdourden08/brock-tools': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-build': minor
---

New module `@drizztdourden08/brock-tools` (`brock add tools`): external binaries an app declares, such as ffmpeg and ffprobe. `getTools(ctx).register({ id, label, binaries, version?, downloads?, resolveDownload?, usePath?, installHint? })` adds a tool; `state` finds it in `Data/tools/<id>/<version>` or on `PATH`, `install` runs the `tool:<id>` job (download through `net.fetch`, size and SHA-256 check, unpack from zip, tar or a bare file, one rename into the cache), and `run` spawns a binary with an argument array, a timeout and a line callback. The renderer gets `window.api.tools` and `useTool(id)`. brock-electron exposes its zip reader and writer as `@drizztdourden08/brock-electron/zip`, and `brock add` knows the `tools` id.
