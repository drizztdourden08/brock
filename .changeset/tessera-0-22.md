---
'@drizztdourden08/brock-react': minor
---

Brock moves to Tessera 0.22.0: the workspace catalog and brock-react's peer range are `^0.22.0` (MIGRATION §192 to §195). RENAMES.json has no entry for 0.22.0, so an app changes nothing. A tour step takes `hint` and a walking `mascot` (`{ walk?, arrive }`, Tessera's `TourStepMascot`), and `before(ctx)` gets `ctx.signal`, aborted when the user leaves the step before it shows. A menu entry with `confirm` takes `onCancel`, run when its question closes without the second click, in the title bar menu and in the search palette. Icon buttons of size `md` are now 39 px, the height of a `md` Button (TX-45): the header Back and close buttons of every screen, so the ScreenLayer header row grows from 32 to 39 px; the title bar keeps its 28 px actions and dense rows keep their `sm` buttons.
