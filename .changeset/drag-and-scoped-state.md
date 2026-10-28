---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
---

Typed drag and drop between widgets, and state kept per project or document.

Drag and drop: `dnd.type<T>(name)` makes a drag type, `dnd.source(element, { type, payload })` makes an element draggable, and `dnd.target(element, { accepts, onDrop, canDrop?, feedback?, index? })` takes the drop. The payload is passed as it is and typed by the drag type. A target gets `enter`, `over`, `leave` and `drop` feedback and a `data-drop` attribute, and `index` reports a position for list-like targets. `useDragSource`, `useDropTarget` and `useDragSession` are the React forms. A target that accepts `dnd.files` also takes files dropped from the desktop: the renderer sends the paths to main (`document:vetDrop`), main checks them with the folder-grant rules and grants what passes, and the app only sees the paths main answered. It works between docked and floating widgets, which share a window; a popped widget window is another renderer and is not covered. `dnd.dragOut(paths)` is a seam that answers false until the main process side lands.

Scoped state: `uiViews.scope(key, { maxKeys? })` keeps named values per project or document in the ui views, with a size cap (200 names per scope and 50 scopes by default, `uiViews.scopeLimits` changes them) that drops the oldest. `useWidgetState(key, initial, { scope })` keeps a widget value in a scope, and `useWidgetStateReady(scope)` says when it has loaded. The `scope:` key prefix is now reserved for scopes.
