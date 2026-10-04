---
'@drizztdourden08/brock-react': patch
---

The review opens every widget the app and its modules register (the `src/widgets` files and module widgets): docked and captured as `widget-<id>`, then popped and captured as `widget-<id>-popped` when its definition sets `popOut`. A context-only widget is shown as `always` for its captures and set back after; a devOnly one is opened only while developer tools are on.
