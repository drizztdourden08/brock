---
'@drizztdourden08/brock-port-kit': minor
---

The audio adapter takes an optional target `sampleRate` and `channels`. Its own AudioContext opens at that rate and each pushed block is resampled (linear) and remixed to it first. Session options `audioSampleRate` and `audioChannels` pass them through.
