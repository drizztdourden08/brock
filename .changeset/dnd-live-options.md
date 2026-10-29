---
"@drizztdourden08/brock-react": patch
---

Fix typed drag and drop going stale. A drag source now reads `disabled` and `payload` when the pointer goes down and when the drag starts, so a source that becomes disabled stops dragging and a drag carries the payload of the latest render. A drop target reads `onDrop`, `canDrop`, `feedback` and `index` live in the same way. A drag source also cancels the browser's own drag (`dragstart`) for an image, link or selected text inside it, so that drag no longer cancels the typed pointer drag. Native file drops into a target that accepts `dnd.files` are not touched.
