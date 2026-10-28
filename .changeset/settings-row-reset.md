---
'@drizztdourden08/brock-react': minor
---

Each settings row now has its own reset. When a settings tab has defaults and the item is not locked, the row gets `changed` (the value differs from its default) and `onReset`, which restores only that key, nested keys included, through the same patch as any other edit. A locked item, an item with no default, and rows of a source section get neither. The section reset stays as it was.
