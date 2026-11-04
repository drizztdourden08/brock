---
"@drizztdourden08/brock-core": minor
"@drizztdourden08/brock-msu": patch
"@drizztdourden08/brock-input": patch
"@drizztdourden08/brock-randomizer": patch
---

New brock-core subpath `util` with the shared `mulberry32` and `itemAt`. The msu, input and randomizer modules now import them from core instead of keeping their own copies.
