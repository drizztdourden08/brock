---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-react': minor
---

`filePicker.pickFile({ extensions, anyType: true })` opens the picker with no type filter, for a file whose extension the system has no type for (Android's picker greys such a file out); the app then checks the name it gets. Without `anyType` every host filters by `extensions` as before.
