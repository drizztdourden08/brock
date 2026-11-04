# Brock mcp

Lets an AI agent drive the running app over MCP: screenshots, mouse and keyboard input, widgets, commands and tools the app defines itself. A stdio helper (`brock-mcp`) talks to the app over the Brock bridge. There is no HTTP port. The contract is in `docs/architecture.md`, "Agent control (MCP)".

## Setup

```
brock add mcp
```

`brock add` installs the package, lists `mcp` in `brock.config.ts` and runs `brock sync`. Options go in the product config. `brock.config.ts` stays erasable TypeScript, so they are plain values:

```ts
// brock.config.ts
modules: ['mcp'],
product: defineProduct({
  // ...
  moduleOptions: { mcp: { dev: true, packaged: false } },
}),
```

| Option | Default | Meaning |
|---|---|---|
| `dev` | `true` | On in an unpackaged run (`brock dev`, `brock start`). `false` turns it off there. |
| `packaged` | `false` | `true` turns it on in a packaged build, ships the helper in `resources/helpers` and keeps Electron's `RunAsNode` fuse on for it. |

Point the agent at the helper. For Claude Code, a `.mcp.json` at the repo root, with the path to the app folder and its user data folder:

```json
{
  "mcpServers": {
    "my-app": {
      "command": "node",
      "args": ["apps/desktop/dist/helpers/brock-mcp.mjs", "--user-data=.user-data"]
    }
  }
}
```

A relative `--user-data` resolves against the app folder (`dist/helpers/../..`), the same way the app does. Other ways to pick the running app: `--instance=<name>`, `--bridge-file=<path>` or `BROCK_BRIDGE_FILE`, or the `select_app` tool at run time. Build first (`brock build`, or `brock dev`) so `dist/helpers/brock-mcp.mjs` exists. With the app down, the helper still lists the built-in tools and each call fails with a hint on how to start the app.

A packaged build that opted in runs the helper with the app executable as Node:

```json
{
  "mcpServers": {
    "my-app": {
      "command": "C:\\Users\\me\\AppData\\Local\\my-app\\current\\My App.exe",
      "args": ["C:\\Users\\me\\AppData\\Local\\my-app\\current\\resources\\helpers\\brock-mcp.mjs"],
      "env": { "ELECTRON_RUN_AS_NODE": "1" }
    }
  }
}
```

## Tools

| Tool | Does |
|---|---|
| `app_info` | App id, name, version, dev flag, window size, visibility and scale. |
| `screenshot` | PNG of the window. `maxWidth` (64 to 3840, default 1280), `settle` (default true), `name` also saves `Data/screenshots/mcp/<name>.png`. Image pixels are CSS pixels times the reported scale. |
| `click` | `x`, `y` in CSS pixels, `button` left, right or middle, `count` 1 or 2. |
| `type_text` | Types `text`, at most 2000 characters. |
| `press_key` | A `chord` such as `Enter` or `Ctrl+Shift+S`. |
| `scroll` | Wheel at `x`, `y` with `dx`, `dy`. |
| `list_widgets` | Every widget with `id`, `label`, `visible`, `available`, `popped`. |
| `open_widget` | `id` and `action` open, close or focus. |
| `list_commands` | Commands with group, enabled state and argument schema, `open:<route>` ones included. `query` filters. |
| `run_command` | `id` and `args` as JSON text, checked against the command schema, run with `trigger: 'assistant'`. |
| `read_ui` | The visible interactive elements and headings with role, name and box. Never a password value. `query` and `max` (default 300). |
| `select_app` | Helper side: switch to another `userData`, `instance` or discovery `file`. |

A failure is a tool error with a code: `mcp-off`, `unknown-tool`, `invalid-arguments`, `no-window`, `timeout` or `failed`.

## Adding app tools

A tool is a name, a description, a flat argument schema and a `run` function. The name matches `^[a-z][a-z0-9_]{1,47}$`; a clash with a built-in or another tool throws. `run` returns a string, JSON or `{ text?, data?, images?, isError? }`. A field in `args` is required unless it sets `optional: true`. Arguments are checked with `validateArgs` before `run`, and the agent sees a JSON Schema built from the same `args`. Mark a tool `readOnly` or `destructive` so the agent client can ask first.

In main, from a main module or a handler group:

```ts
import { defineMcpTool } from '@drizztdourden08/brock-mcp';
import { getMcp } from '@drizztdourden08/brock-mcp/main';

const countDocs = defineMcpTool({
  name: 'count_docs',
  description: 'Number of documents in the open library.',
  readOnly: true,
  run: () => ({ data: { count: library.size() } }),
});

const unregister = getMcp(ctx).tools.register(countDocs);
```

In the renderer, for a tool that needs the page. `useMcpTools` registers on mount and removes on unmount, like `useCommands`:

```tsx
import { defineMcpTool } from '@drizztdourden08/brock-mcp';
import { useMcpTools } from '@drizztdourden08/brock-mcp/renderer';

const TOOLS = [
  defineMcpTool({
    name: 'select_row',
    description: 'Selects a table row by id.',
    args: { id: { type: 'string', label: 'Row id' } },
    run: ({ id }) => selectRow(String(id)),
  }),
];

export const Table = () => {
  useMcpTools(TOOLS);
  return <Rows />;
};
```

`mcpTools.register(def)` is the same without a component. `getMcp(ctx).status()` returns `{ enabled, packaged, tools }`, and `setEnabled(on)` switches the module at run time. `mcpApi()` in the renderer reads the status and flips the switch, for a settings toggle.

## Turning it off

- `--no-mcp` on the app command line.
- `BROCK_MCP=off` (or `0`, `false`) in the environment.
- `moduleOptions: { mcp: { dev: false } }` to keep it off in development.
- `getMcp(ctx).setEnabled(false)` at run time. Every route then answers `mcp-off`.

The environment never turns on a packaged build that did not opt in. Without `packaged: true`, a packaged app registers no routes, ships no helper and keeps the `RunAsNode` fuse off for it.

## Security

The bridge is a private local pipe or socket with a per-session secret and a discovery file only the user can read. The module adds its own limits: input goes only to the app's own window, screenshots are written only under `Data/screenshots/mcp`, and no tool takes a path or evaluates code.

The user account is still the boundary. A packaged build with `packaged: true` lets any program running as the same user read the discovery file and take full control of the UI: click, type, run commands, read the screen. Turn it on only for a build whose users accept that, and never ship an app tool that does more than the user could do anyway.
