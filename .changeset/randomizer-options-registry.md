---
'@drizztdourden08/brock-randomizer': minor
---

RandomizerTypeRegistry takes an options slot, like frozenSettings. A game that sets it gets its own type for RandomizerProfileConfig.options; without it the type stays Record<string, unknown>.
