<!-- @layer docs @kind doc -->
# Code structure

The structure every repo of the family follows (top level, packages, one thing per file, component and module folders, the token tiers, the rule table and where exceptions go) is now one guide in `@drizztdourden08/standards`: [docs/structure.md](https://github.com/drizztdourden08/standards/blob/main/docs/structure.md). The rules live in that package; `brock-lint-config` is Brock's app preset on top of it, and `brock structure` and `brock prose` run the standards checks with Brock's extension.

Brock's extension, declared by `brock-build` and `brock-lint-config` in their `package.json` and loaded wherever they are installed, adds:

| Adds | Where |
|---|---|
| `brock.config.ts` marks an app: no package name or barrel check | `brock-build/standards.extension.mjs` |
| `build/installer` holds only the two overrides | `brock-build/standards.extension.mjs` |
| `src/screens` has its own checks (layout, search entries, `screens.config.ts`) and the custom-page note | `brock-build/standards.extension.mjs` |
| `<id>.task.ts` is a module file (boot tasks) | `brock-build/standards.extension.mjs` |
| raw-control messages name the Tessera components; screen files, module entries, `brock.workspace.mjs` and boot tasks may default-export; screen files are lists | `brock-lint-config/standards.extension.mjs` |
| `@drizztdourden08/tessera/tokens.css` is a token source for `brock/no-token-*` | `brock-lint-config/standards.extension.mjs` |

A design-system package that must carry `Name.usage.ts` in every component folder lists `@drizztdourden08/standards/extensions/usage-files` in its `standards.config.mjs`; the `brock.designSystem` flag is gone.

## Adopting it in a repo

```
npx brock adopt --scope @myscope [--local X:\brock]   # lint configs, pnpm-workspace.yaml, .npmrc, the lint-config and brock-build dependencies (link: with --local)
pnpm install
npx brock structure --check
pnpm lint
```

`brock adopt` also writes the knip entries a thread repo needs (`brock.workspace.mjs`, `.worktrees/**` ignored, `brock-thread` ignored when linked) and appends the generated outputs to `.gitignore` (`build/icons`, `build/splash`, the generated `public/logos` files, `.brock/profile-config.json`, `.brock-port-slot`). `brock check` and `brock sync` at the root run once per app that `brock.workspace.mjs` targets.

`brock adopt` never overwrites an existing file unless `--force` is given, and never touches an existing `pnpm-workspace.yaml` or `.npmrc`. A repo that is not a Brock app uses only this: the lint stack and the structure check do not need `bootstrapApp` or `BrockApp`. A single-package repo (Tessera: `src/` at the root, no `packages/`) is checked as one package.

## A Brock app inside a workspace

An app with its own subject packages is a workspace: `apps/desktop` is the Brock app, `packages/<subject>` the rest.

```
cd my-repo
npx brock adopt --scope @myscope --local X:\brock          # the root: pnpm-workspace.yaml, .npmrc, lint configs
npx create-brock apps/desktop --name "My App" --id my-app --app-id com.example.my-app --local X:\brock --yes
pnpm install
```

While Brock is unpublished, `brock add <id> --local X:\brock` links a module from the checkout instead of installing it from a registry. A `link:` dependency resolves outside the project, so knip cannot see it being used; `create-brock --local` lists the linked runtime packages under `ignoreDependencies` in the app's `knip.json`, and the entries go when the packages are published.

`create-brock` sees the `pnpm-workspace.yaml` above the target and becomes a workspace member: it merges the catalog entries the app needs into the root file, writes no `pnpm-workspace.yaml`, `.npmrc` or lint config of its own (the root owns them), and `brock sync` keeps skipping those files for that app.

## What an app declares

A workspace package is bundled into the app's main and preload from source; its npm dependencies are not. They load from `node_modules` at runtime, and under pnpm's strict layout only the app's own `node_modules` is on that path. So the app declares every package its main and preload bundles still import, even when a workspace package is the one using it. The build enforces it: `brock build` fails before writing a bundle and lists the missing lines, `"ssh2": "^1.17.0",` style, to paste into `apps/<app>/package.json`. Use `catalog:` where the workspace has an entry.

## Threads: one worktree per piece of work

`brock adopt` writes `brock.workspace.mjs`, the one file that tells the thread CLI what the repo is: its name (the repo's command), its base branch, its launch targets (`electronTarget` for an app, `serveTarget` for a dev server), the provision steps every worktree gets, and the plugins.

Every repo carries its own command, named after the workspace: `archipelia`, `tessera`, `rotp`. `brock adopt` and `create-brock` write it to `bin/<repo>.mjs`, a plain Node file with no dependencies, and add `"bin"` and a `postinstall` of `node bin/<repo>.mjs --link` to the root `package.json`. That command is how you run everything in the repo, and the docs and hints of a repo name it, never `brock`. It reaches the global `brock` (`@drizztdourden08/brock`, from GitHub Packages), which then runs the `brock-build` version the repo pinned in its own `node_modules`.

First time on a machine:

1. `pnpm install` in the repo. The postinstall writes `<repo>` and `<repo>.cmd` into the npm global bin folder; each walks up from the current folder to the nearest `bin/<repo>.mjs`, so the command works in every checkout and worktree. It is skipped when `CI` is set and never fails the install.
2. Run `<repo>` once in a terminal. When the global `brock` is missing it asks to install it, sets the `@drizztdourden08` registry when npm has none, checks `npm whoami` against GitHub Packages and prints the fix when that fails (`gh auth refresh -h github.com -s read:packages`, then the token from `gh auth token` in the npm config, which it offers to write after a second question). Without a terminal (CI, an assistant) it never asks or installs: it prints the install command and exits 1.

The verbs then work the same in every repo:

```
<repo> worktree create <name> [--from <ref>]        add the worktree, install, run the provision steps
<repo> worktree launch <name> <state|none> [--visible]   the target, in that worktree, headless by default
<repo> worktree refresh <name> [--reset] [--rebase]
<repo> worktree commit [name] --message "..."       the repo hooks run; --no-verify is refused
<repo> worktree finish [name]                        guards, remove, retire the branch when merged
<repo> pr push | open | status [name]                push and open put work on a public repo and ask
```

A plugin adds verbs, targets and steps through `definePlugin`: `@drizztdourden08/brock-plugin-snes` for a SNES port, a repo's own plugin package for its own tooling, and the assistant plugin that lives in the ai-config repo. Everything a person and an assistant both do is in the core; what only an assistant does is in that one plugin.

## pnpm

- `workspace:*` between packages of the repo; `catalog:` for every shared version; one line in `pnpm-workspace.yaml` bumps a dependency everywhere.
- `pnpm -r --filter "./packages/**" lint` runs a script in every package; `--filter "...^@scope/x"` runs it in what depends on `x`; `--filter "[origin/master]"` in what changed on the branch.
- An unpublished sibling repo is linked with an `overrides` entry `"@drizztdourden08/tessera": "link:../tessera"` for a local session, removed once the package is published.
