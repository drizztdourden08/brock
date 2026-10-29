---
'@drizztdourden08/brock-build': minor
---

The main process and preload builds now fail when their module graph reaches renderer-only code, and the error prints the import chain from the entry to the forbidden module.

- Forbidden by default: every Tessera package, `react`, `react-dom`, `@drizztdourden08/brock-react` and the renderer folders of `src` (`screens`, `widgets`, `views`, `compounds`, `composites`, `primitives`, `stores`, `hooks`, `title-bar`, `tours`, `toolbars`, `startup`, `main.tsx`, `index.html`). Type-only imports do not count.
- The new `mainProcess` option of `brock.config.ts` adds to the list and lists exceptions: `mainProcess: { forbid?: string[], allow?: string[] }`. Each entry is a package name (its subpaths are covered) or a path glob relative to the app folder. `allow` wins over the defaults and over `forbid`.
- The check runs in `brock build`, `brock dev` and `brock start`, since all three use `defineBrockViteConfig`. An app that already imports renderer code from main now fails until it cuts the import or lists it in `mainProcess.allow`.
