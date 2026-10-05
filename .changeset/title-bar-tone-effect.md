---
'@drizztdourden08/brock-react': minor
---

App title bar items (`src/title-bar/<id>.action.ts`) take `tone` (any Tessera `StatusTone`) and `effect` (an `IconEffect`) on buttons and status tags, the same values Brock's Search and Report a bug items use. Tessera's title bar dropdown has neither, so a menu item takes none.
