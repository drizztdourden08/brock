---
'@drizztdourden08/brock-build': patch
---

`brock migrate` replays Tessera's component renames into usage files (`<Name>.usage.ts`, which `tessera guide` reads): the part each `avoidWhen` entry names in `use`, such as `use: 'ManagedList'`, becomes `use: 'ItemList'`, and a note there becomes a to-do. The `example` string replays as code of its own, so its Tessera import, the tags and references it holds and the release's entry point moves follow. No other string in a usage file changes, and a `use` key anywhere else is left alone. Before, after an upgrade the guide reported `avoidWhen names ManagedList` and could not compile the example.
