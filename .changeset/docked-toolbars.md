---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-lint-config': minor
---

Docked toolbars by convention, on Tessera `^0.56.0`. An app puts a toolbar in `src/toolbars/<id>.toolbar.tsx`, default-exporting `defineToolbar({ id, label, defaultSide, hiddenByDefault?, render(slot) })`; `slot` carries the orientation, the grip `handle` and the `side`. `brock sync` lists the files in `.brock/toolbars.ts` as `appToolbars`, `brock structure` accepts and checks the folder, and `RendererModule.toolbars` adds a module's toolbars.

`BrockApp` takes `toolbars` and, when at least one is registered, wraps the widget host in Tessera's `ToolbarDock` inside `brock-app__stage`. An app with no toolbars is unchanged. The layout is saved per profile as its own `toolbarLayout` key in `ui-views.json` beside `widgetLayout`, loaded with `migrateToolbarLayout`, and defaults to `createToolbarLayout`. `useToolbarMenuEntries()` adds a Toolbars sub-menu to Widgets, with its own Reset toolbars entry; Reset layout still resets widgets only.

The `toolbar-files` migration (0.86.0) adds `toolbars={appToolbars}` and its import to `src/main.tsx`. The lint stack allows the default export in `src/toolbars/*.toolbar.tsx`.
