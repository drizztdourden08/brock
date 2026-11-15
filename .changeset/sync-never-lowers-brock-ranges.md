---
'@drizztdourden08/brock-thread': patch
'@drizztdourden08/brock-build': patch
---

`brock sync` no longer lowers a Brock range that is above `brock.version`. It keeps the range and warns that the pin is behind, with the `brock upgrade` command that moves it. `brock upgrade` still moves every range to its target, a downgrade included. `followBrockPin` takes `{ keepAhead: true }` for this and returns the kept fields as `ahead`.
