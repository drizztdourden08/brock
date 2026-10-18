---
'@drizztdourden08/brock-react': minor
---

Brock moves to Tessera 0.43.0. The two workarounds from 0.62.0 are gone: the Escape guard for a revealed title bar (Tessera's peek now handles that Escape itself) and `isolation: isolate` on `.brock-app__content` (the revealed bar has its own `--z-title-bar` layer). The behaviour is the same. Tessera renamed the `dock-resize*` classes to `rect-resize*`, so an app that styled or selected `dock-resize*` must use the new names.
