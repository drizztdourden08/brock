---
"@drizztdourden08/brock-react": minor
---

A hub header backdrop. `backdrop` on a bucket in `screens.config.ts` (or on a `defineHub` def) draws behind the header of every page of the hub, and `backdrop` in a page's `meta` overrides it for that page and its sub-pages. It takes the shape of a hero backdrop: `{ kind: 'node', node }`, `{ kind: 'image', src, fit?, position?, tileSize?, color?, pixelated? }`, `{ kind: 'color', color }` (a CSS colour or a token name such as `'--c-secondary'`), or `{ kind: 'none' }` to draw no art. `HubPageFrame` passes it to Tessera's `ScreenPage` and `SettingsPage` and through the settings page context, so settings pages get it too; without one the header keeps Tessera's art.
