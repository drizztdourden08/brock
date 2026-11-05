---
'@drizztdourden08/brock-randomizer': minor
---

The Archipelago network status gains the items sent to other players, hint points, the reconnect attempt and next retry time, the ping mean and sample count, and the tracker link progress of each player. Tracker links now follow the connection: a drop closes them and resets the roster, a reconnect reopens them, and a player's online state reads null until the server says otherwise.

A received item from a negative location now names the server as its sender.

A drop now closes the tracker links before the roster resets, so the roster asks again after the reconnect. A location scout lost to a drop is sent again on the next connect.

The roster no longer sends '!players', so connecting no longer echoes it in every player's chat; online reads null until a Join, Part or tracker link says otherwise.
