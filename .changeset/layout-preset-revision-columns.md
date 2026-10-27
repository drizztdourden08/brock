---
'@drizztdourden08/brock-react': minor
---

Layout presets grow. `defineLayoutPreset({ revision })` (a number, 1 when unset) versions the default layout: a profile stores the revision its saved layout came from, and when the preset is newer Brock shows one toast with Reset, where closing it keeps the profile's layout and stores the new revision. `onRevision: 'apply'` resets to the new layout at load instead of asking. A cell can now be a column of stacked panes, `{ column: ['players', 'hints'], sizes: [0.6, 0.4] }`, and a row written `{ cells: [...], under: 'main' }` sits under the main view only instead of across the full width. `toast` takes an `onClose` option.
