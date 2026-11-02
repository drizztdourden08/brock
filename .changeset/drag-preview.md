---
'@drizztdourden08/brock-react': minor
---

Add `preview: { label, count? }` to `dnd.source`, `useDragSource` and `useFileListDrag`. It shows a drag ghost beside the pointer, for example a count such as "3 sprites" when several tiles or rows are dragged. `label` and `count` are a value or a function of the payload. A source without `preview` is unchanged.
