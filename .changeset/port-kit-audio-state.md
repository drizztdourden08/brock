---
'@drizztdourden08/brock-port-kit': patch
---

The audio adapter now writes the audio context state, sample rate, sink, base latency and gain to the session log. It logs at the first samples, on every state change and once a minute. When the browser suspends or interrupts the context, the adapter resumes it, unless the game paused the audio on purpose.
