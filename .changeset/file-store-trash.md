---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-catalog': minor
---

`FileStore` has an optional `trash(path)`. The Node store behind `ctx.files` moves the path to the system trash (`shell.trashItem`) and skips one that is not there. A catalog uninstall or update hands its installer a store whose `remove` goes to the trash when the store has one, falling back to deleting when the trash refuses; `removeTo: 'delete'` in the catalog config deletes as before.
