---
'@drizztdourden08/brock-react': patch
---

The Capacitor file picker opens with no type filter, so a file whose extension Android has no type for (a save file, a ROM) can be picked; the app checks the name it gets.
