---
'@drizztdourden08/brock-core': patch
'@drizztdourden08/brock-electron': patch
'@drizztdourden08/brock-react': patch
---

Importing a data area asks Merge (the default) or Replace in its confirm dialog (`confirmChoice`, a confirm dialog with a radio group). Merge keeps what is there and keeps the newer file when both have the same path; `storage:applyImport` takes the mode, the result counts the kept files (`kept`), and imported files keep the modified time they were exported with.
