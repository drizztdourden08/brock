---
'@drizztdourden08/brock-build': patch
---

With `build.nodePolyfills` on, the renderer and web builds alias `vite-plugin-node-polyfills/shims/buffer`, `/process` and `/global` to the copy the app resolves. The plugin injects those imports into every file that uses Buffer, process or global, and a workspace package outside the app could not resolve them under pnpm.
