<!-- @layer docs @kind doc -->
# @drizztdourden08/brock-thread

The thread lifecycle every Brock repo runs: one git worktree per piece of work, launched in isolation, committed through the repo hooks and published through two verbs that ask.

```
<repo> worktree create <name> [--from <ref>]
<repo> worktree launch <name> <state|none> [--target <key>] [--prod] [--visible [--sound]]
<repo> launch main <state|none> [--visible] [--review]
<repo> worktree refresh <name> [--reset] [--rebase [ref]]
<repo> worktree commit [name] --message "<text>"
<repo> worktree finish [name] | remove <name>
<repo> pr push | open | status [name]
```

`main` names the main checkout. `launch main` runs the app from the repo root with its own `.user-data`, provisioned on the first launch, so a freshly scaffolded app runs before any worktree exists. No worktree verb accepts `main` as a name.

`<repo>` is the repository's own command (`archipelia`, `tessera`, `rotp`): `bin/<repo>.mjs` at the repo root, written by `brock adopt` or `create-brock`. It is how you run everything in the repo; it reaches the global `brock`, which runs the Brock version the repo pinned. Every hint and usage line these verbs print names the workspace's command, never `brock`.

A repository describes itself in `brock.workspace.mjs` through `defineWorkspace`: its name (which is also the command's name), base branch, launch targets (`electronTarget`, `serveTarget`), provision steps and plugins. A plugin adds verbs, targets and steps through `definePlugin`.

## Ports

`@drizztdourden08/brock-thread/ports` holds the port scheme. An app's block starts at `product.ports.base`: `+0` is the dev renderer, `+1` to `+9` are for its tools. `portFor(base, slot, offset)` returns one port and refuses an offset outside the block.

The main checkout is slot 0. `worktree create` runs the `port-slot` provision step, which gives the worktree the lowest slot from 1 that no other registered worktree holds and writes it to `.brock-port-slot` at the worktree root; the file name goes into `.git/info/exclude`. `launch` of an older worktree writes the file the same way. Slot N moves the block to `base + 10 x N`; slots stop at 19. `portSlotOf(dir)` reads `BROCK_PORT_SLOT`, then the file of the checkout holding `dir`, then 0.

`derivePortBase(id)` is the base when an app sets none: one of 140 multiples of 200 from 20000 to 47800, picked by an FNV-1a hash of the id.

## First time on a machine

1. `pnpm install` in the repo. Its postinstall (`node bin/<repo>.mjs --link`) writes the `<repo>` and `<repo>.cmd` shims into the npm global bin folder. Skipped when `CI` is set; it never fails the install.
2. Run `<repo>` once in a terminal. When the global `brock` is missing it asks to install `@drizztdourden08/brock` from GitHub Packages. Without a terminal it prints the install command and exits 1.
