---
'@drizztdourden08/brock-react': minor
---

`BucketDef` takes `switcher: false` (default true) to keep a bucket out of the top hub switcher. `menu: 'hidden'` only drops the app menu entry, so such a bucket still showed as a tab. A switcher-hidden bucket still opens through its menu entry, its shortcut, a search result and `open('bucket/page')`, and the switcher shows no tab as selected while it is open. `defineHub` takes the same `switcher` field.
