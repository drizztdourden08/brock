---
'@drizztdourden08/brock-react': patch
---

Brock moves to Tessera 0.30.1: the workspace catalog and brock-react's peer range are `^0.30.1` (MIGRATION 215 to 218). `CommandPalette` is now on the escape stack itself, so Brock drops its capture phase Escape listener for the palette's confirm questions. Escape in the palette cancels a row's question first, wherever focus is, then clears the search text, then closes the palette. After a question ends, focus goes back to the button that asked, so the arrow keys and typing keep working in the palette. An app changes nothing.
