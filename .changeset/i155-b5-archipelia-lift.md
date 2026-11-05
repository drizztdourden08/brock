---
'@drizztdourden08/brock-randomizer': minor
---

The randomizer module now carries the Archipelia lobby client, the lobby socket and the Archipelago world export. A game plugs in through the new `ArchipelagoGame.archipelia` hook and plain inputs to the export functions. New `./preload` subpath exposes `window.api.randomizer` with the lobby socket and the save-files call.
