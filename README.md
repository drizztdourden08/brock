<!-- @layer docs @kind doc -->
# Brock

The base-app foundation for Electron + React desktop apps built on Tessera. Packages plus a builder: an app installs the packages it needs, `create-brock` writes the thin skeleton, and optional modules plug in through one manifest each. `docs/architecture.md` is the contract; `docs/contributing/structure.md` is the folder standard every package follows.

## Layout

```
pnpm-workspace.yaml      the workspace list and the catalog of shared versions
packages/lint-config     Brock's app preset on @drizztdourden08/standards, the lint stack every Brock repo runs
packages/core            isomorphic: product config, the open IPC contract, ports, storage, settings, log bus
packages/electron        main-process bootstrap, window, handlers; the preload bridge
packages/react           BrockApp shell, stores kit, screen registry, settings engine, shell views
packages/build           Vite and electron-builder factories, the brock CLI
packages/thread          the thread lifecycle: worktrees, launch targets, pr verbs, plugins
packages/plugins/snes    the SNES PC-port bundle: wasm core, ROM, save states, fixture vault
packages/create-brock    the scaffolder
packages/modules/*       optional modules: updater, secrets, input, display, port-kit
templates/app            the blank app: the create-brock template and the in-repo sample
docs/                    architecture and standards
```

Every package depends on its siblings with `workspace:*` and on shared tooling with `catalog:`; the versions live once, in `pnpm-workspace.yaml`. Tessera is an unpublished sibling checkout, linked through the `overrides` entry in that file.

## Commands

```
pnpm install
pnpm lint             tsc, eslint (typed), stylelint, brock prose, brock knip, jscpd over every package and the template
pnpm lint:md
pnpm prose            brock prose: the writing gate over the text files the other linters skip
pnpm deadcode         brock knip: knip over the paths git does not ignore; unused files, exports, types and dependencies
pnpm duplicates       jscpd: duplicated blocks across TS, JS and CSS
pnpm structure        brock structure --check: package names, barrels, folder names, depth
pnpm app:build        build the in-repo blank app
```

## A blank app

```
node packages/create-brock/bin/create-brock.mjs <dir> --name "My App" --id my-app --app-id com.example.my-app --local X:\brock --yes
cd <dir> && pnpm install && pnpm lint && pnpm build
pnpm start:headless -- --user-data=.user-data --screenshot=boot     # boots off screen, muted, quits
pnpm start -- --user-data=.user-data                                # the window
```

An app inside its own workspace (`apps/desktop` plus `packages/<subject>`): run `brock adopt` at the repo root first, then `create-brock apps/desktop ...`; see `docs/contributing/structure.md`.

`--local` writes `link:` dependency specs to this checkout and to `../tessera`, for use while nothing is published.
