---
'@drizztdourden08/brock-react': minor
---

`brock-react` now exports `chordKeys(chord, mac?)`, which turns a chord into its keycaps in order, plus `useIsMac()` and `isMac()` to read the platform flag of the command store. `useCommandChords(id)` was already reactive and now has a keep test. Use them to show shortcut hints without parsing chords by hand.
