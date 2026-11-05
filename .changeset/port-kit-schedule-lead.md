---
'@drizztdourden08/brock-port-kit': minor
---

The frame loop gains setSchedule with a display mode (the default, paced by the display) and a timer mode (a drift-corrected 60 Hz timer). The audio adapter takes an options object with leadS, how far ahead of the audio clock samples are queued, and the port session passes it through as audioLeadS. Omitting both keeps today's behaviour.
