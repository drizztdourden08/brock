---
'@drizztdourden08/brock-msu': minor
---

The MSU module gains its host side and the first part of its studio UI. A new `msu` IPC namespace carries `.msul` reading, the optimize measure and convert run with progress events, and the audio probe. The main entry holds the handlers and the ffmpeg tool definition, and the renderer entry holds `defineMsuStudio`, `MsuStudioProvider`, the music debugger widget, file audition and `useMsulOpen`. The renderer also exposes `createMsuStore(game, deps)`, the pack store behind the studio, and `useMsuStudio()`, which returns the game and the store.
