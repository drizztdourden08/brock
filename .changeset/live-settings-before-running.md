---
'@drizztdourden08/brock-port-kit': minor
---

Settings pushed before the core runs are no longer lost. `createLiveSettings(core)` listens to the core and applies the last pushed settings each time the core starts running, and again after a restart; a plain `{ calls, apply }` target can pass `subscribe` for the same. The new `dispose()` stops listening. `createPortSession` applies the settings pushed while the core loaded when it starts, and uses its `settings` option only when nothing was pushed, where it used to overwrite them with the option.
