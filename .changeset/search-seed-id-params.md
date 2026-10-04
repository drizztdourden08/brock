---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': patch
---

`SearchEntrySeed` takes an optional `id` and `params`. `id` is the entry's key, so two entries with the same label and no anchor no longer collapse into one, and `params` are passed to `open` when the entry is picked (a Presets entry opens with its `presetId`). A hub search keeps live entries with params. A custom page's literal `searchEntries` may carry both too.
