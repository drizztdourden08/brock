---
'@drizztdourden08/brock-display': minor
---

Adds an aspect ratio control and its ratio math. The `./aspect-ratio` export holds the pure math (clamp and reduce, nice ratio, custom ratio check, screen and viewport detection), and the renderer exports `AspectRatioControl`, which takes the presets, the limits, a letterbox flag, the value and an onChange.
