---
'@drizztdourden08/brock-port-kit': minor
---

Port kit can keep a ROM's original file name. `rom.keepFileName: true` in the port definition stores an imported ROM as `roms/<original name>` and its asset blob as `assets/<original stem><extension>` rather than `roms/<identity.id><ext>`, and `list()` then identifies each stored ROM by its SHA-1. Names with spaces, commas, brackets and parentheses are allowed; a name a disk would refuse is not. The default stays the identity id naming. The stored bytes are the normalized dump in both modes.
