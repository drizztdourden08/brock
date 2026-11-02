---
'@drizztdourden08/brock-react': minor
---

Commands gain default bindings with bound arguments (`bindings: [{ args, chord }]`), so one command serves many keys and each key is a Keyboard page row named after its argument. A chord can name a key before the last one (`Space+B`), and a hold command stays held while the last key is down. `chordOfKeys` is exported from the package entry, and `openKeymapAt(route, commandId, args?)` opens the Keyboard page at one command, scrolls to it and highlights it.
