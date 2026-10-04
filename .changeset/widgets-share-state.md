---
'@drizztdourden08/brock-react': minor
---

App state reaches popped widget windows through a public API. `shareWithWidgets(store, { kind, pick })` in the main window (a boot task is a good place) publishes `pick(state)` to every widget window, debounced, only while a widget is popped, at once when a window opens and again on a profile switch; it does nothing in a widget window. `useWidgetSlice(kind, fallback?)` reads the slice in both windows, so a widget reads its data the same way docked or popped. Brock's own frames and widget prefs relay now go through it.
