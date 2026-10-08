---
'@drizztdourden08/brock-build': minor
---

`build` in `brock.config.ts` sets what the managed Vite configs take, so `electron.vite.config.ts` stays one line. `build.aliases` adds import prefixes beside `@app`, each a folder relative to the app folder, for main, preload, the renderer, its workers and the web build, and `brock sync` adds them to the managed `tsconfig.json` paths; `@app` stays Brock's. `build.nodePolyfills` (`true` or the options of `vite-plugin-node-polyfills`, which the app installs and `brock knip` counts as used) puts the polyfills in the renderer and in every worker build. Workers now build as ES modules (`worker.format: 'es'`), so a worker takes dynamic imports too, and a `public/wasm/` folder is served and copied as it is.
