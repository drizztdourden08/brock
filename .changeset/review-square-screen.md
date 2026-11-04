---
"@drizztdourden08/brock-react": patch
---

The app review checks full screen on a registered screen drawn in a screen layer: settings, then profiles, then the first other one. About draws its own layer, so `cluster-fullscreen` never found the square screen there.
