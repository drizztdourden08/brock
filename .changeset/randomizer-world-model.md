---
'@drizztdourden08/brock-randomizer': minor
---

The randomizer module now ships a generic Archipelago world model. worldModelOf takes a fill world, the option values and a set of hooks the game passes in, and returns the model the apworld loader reads. preRolledOf wraps it as the pre-rolled block. plainOptionValue and snapshotOfPlainOptions turn plain player-file values into option values against a game's option catalog.
