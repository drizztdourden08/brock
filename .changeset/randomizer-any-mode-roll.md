---
'@drizztdourden08/brock-randomizer': minor
---

The Connection step of the profile wizard now shows for any mode that has an entry in `views.connection`. An entry is either a body component, as before, or a `ConnectionView`: `{ Body, validate?, summary? }`. Both hooks get the connection slice values and the wizard values. The online mode keeps its server fields, its checks and its summary when the game gives no entry for it. The review lists the connection of a custom mode with its summary.

`game.roll` now runs for every mode except online. `RollContext` carries the `mode` and the `connection` values of the wizard, as an opaque record the game reads. The wizard passes them on `CreateProfileOptions.randomizerConnection`, and other callers can pass them the same way.

`roll` may return `joinedRoll(result)`, a `RollJoined` (`{ kind: 'joined', result }`), in place of a placement. No placement is written then. `game.onJoined(result, { profileId, config })` runs once the profile is created. A roll that returns a placement works as before. `isJoinedRoll` tells the two apart.
