---
'@drizztdourden08/brock-react': patch
---

Back is Tessera's: a screen passes `onBack` to ScreenWindow, whose header draws Back outside the heading, so the hub dialog is named by its title alone (it read "Back Multiworld"), and a hub sub-page passes `back: { label, onSelect }` to ScreenPage for its "Back to <page>" button (B-07, B-08).
