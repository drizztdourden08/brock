---
'@drizztdourden08/brock-react': minor
---

A tour step can now reset the screen it shows with `reset: true`, or `reset: { search, filters, tab, selection }` for some parts, so a tour always starts from a clean view. Brock clears the matching screen state before it lights the target and waits one frame. The hub page search, the hub tab, the window section and the settings search are cleared for you. `useScreenState` takes an optional third argument naming the part a key holds, and the new `useTourReset(handler)` hook covers state kept outside that store. A screen with nothing to reset is left alone. New shell targets: `{ shell: 'primary' }` (the primary button of the open screen header), `{ shell: 'back' }` (the Back button of a sub page), `{ shell: 'menu-panel' }` (the open root app menu panel) and `{ shell: 'rail', entry: 'Games' }` (one sidebar entry of the open screen by its label).
