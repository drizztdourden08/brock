---
"@drizztdourden08/brock-electron": minor
---

A hidden launch now draws WebGL. Hardware acceleration stays off, and the launch adds `enable-unsafe-swiftshader`, so a WebGL canvas renders on SwiftShader, the CPU renderer Chromium ships. It draws the same pixels on every host, with or without a GPU. A screenshot baseline run uses the same path.

`--gpu` keeps hardware acceleration in a hidden launch, for a heavy WebGL check on a machine that has a GPU. A GPU-less host must not pass it.
