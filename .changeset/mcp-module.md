---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-mcp': minor
---

New `mcp` module (`brock add mcp`): an outside agent drives the running app over MCP through a stdio helper on the Brock bridge. Built-in tools take screenshots, click, type, press keys, scroll, list and open widgets, list and run commands, and read the visible UI. An app adds its own with `defineMcpTool` in main (`getMcp(ctx).tools.register`) or in the renderer (`useMcpTools`). It is on in development and off in a packaged build unless `product.moduleOptions.mcp.packaged` is true; the config file is the only control. `nav.route()` in brock-react answers the full current route (screen, section and tab, or the base view when no screen is open).

The module needed four foundations. brock-core gets `@drizztdourden08/brock-core/args` (`ArgSchema` and `validateArgs`, which brock-react still re-exports), the open `ModuleOptions` interface with `product.moduleOptions`, and `helpers` in the module manifest. brock-electron gets `ctx.bridge.extend` so a module adds bridge routes, `bridgeFileFor`, and `waitCaptureHolds` beside `captureFrame`. brock-build bundles a module's helpers to `dist/helpers/<name>.mjs` and ships them, with the `RunAsNode` fuse, only when `moduleOptions[id].packaged` is true. brock-react changes nothing for apps.
