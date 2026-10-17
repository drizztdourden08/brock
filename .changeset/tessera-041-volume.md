---
'@drizztdourden08/brock-react': minor
---

Brock moves to Tessera ^0.41.0, and a `volume` title bar item is now Tessera's volume bar item: a 28 px volume control whose slider opens on hover or focus, and a click on it mutes. Once it folds, the main menu holds a Mute or Unmute row and a slider row. The spec is unchanged (`kind: 'volume'`, `label`, `value` from 0 to 1, `muted`, `onChange`, `onMuteToggle`, `shortcut`), and Brock calls `onMuteToggle` when Tessera asks for the other muted state. The review's `volume` step now also checks that hover or focus opens the slider and that moving it changes the volume, and the narrow menu must hold both rows. Apps upgrade with `brock migrate`.
