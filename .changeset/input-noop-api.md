---
'@drizztdourden08/brock-input': minor
---

`inputApi()` no longer returns null. On a host with no input side it returns `noopInputApi`, which reports controllers off, lists nothing, refuses every action and hands back an unsubscribe for every subscription, so app code needs no null check. `isInputAvailable()` tells whether a real input host is there. Existing `inputApi()?.` calls keep working; they can drop the `?.`.
