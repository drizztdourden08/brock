---
'@drizztdourden08/brock-react': minor
---

Every widget's state is kept per profile and comes back after a restart and a profile switch. `useWidgetState(key, initial)` is `useState` for the widget it is drawn in (it reads the widget id from `useWidgetId()`), stored with that widget's `useWidgetPref` values, relayed to its popped window and kept when the widget unmounts under a screen. `useWidgetStateReady()` turns true once the profile's saved values have arrived. Pending writes are flushed on `pagehide` and `beforeunload`, and a malformed saved widget entry is dropped instead of reaching the widget.
