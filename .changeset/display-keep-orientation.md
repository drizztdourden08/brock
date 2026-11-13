---
'@drizztdourden08/brock-display': minor
---

`aspectRatioValue` takes `keepOrientation`. With it set, 'auto' and 'screen' keep a portrait window or screen portrait (width below height) instead of turning it to landscape. The result is still clamped to the limits, so a very tall screen stops at `limits.min`. `detectViewportRatio` and `detectScreenRatio` take the same flag as a third argument.
