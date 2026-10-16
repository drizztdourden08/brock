---
'@drizztdourden08/brock-build': minor
---

The renderer dev server pre-bundles what Brock can find before the first page loads, so a cold start runs Vite's dep optimizer once instead of finding dependencies as the page asks for them, re-running it and reloading. `defineBrockViteConfig` sets `optimizeDeps.include` on the dev server: React and `react-dom/client`, the renderer entries of Tessera and of the Brock packages installed in `node_modules`, and every package import of the files under `src/` and of the linked workspace packages they reach (deep icon imports and the imports of worker files included; an import only a linked package can resolve is written `<linked> > <dep>`). The new `build.optimizeDeps` in `brock.config.ts` takes `include`, `exclude`, `entries` and `worker`, the dependencies only a renderer Web Worker imports that the source read cannot see (`worker: ['fs', 'crypto', 'path']` with `nodePolyfills`).
