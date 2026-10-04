---
'@drizztdourden08/brock-react': patch
---

`ProfilesPanel` is drawn by Tessera's `ManagedList`, its props unchanged. The create form is an `InlineCreateForm` in the list's `create` slot, at the top of the list: New opens it with focus in the name field, Escape or Cancel closes it and puts focus back on New, and after a create that selects the new profile focus goes to its row. While no profile exists (`createOpen`) the form stays open with no Cancel, Escape leaves it open, and it stays open until the first create resolves. A press or Enter on a row still makes it the active profile; the arrow keys, Home and End only move the pick, so moving through the list never switches profile, and the picked row shows its rename (also F2) and delete, which still asks once in the row. A failed rename shows its message above the list. The rename and delete buttons now show only on the picked row, as `ManagedList` draws them, where they were on every row before.
