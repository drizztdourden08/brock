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

## Releasing Brock

Brock publishes with changesets, and every release has a note in the release note standard of `@drizztdourden08/standards` (`docs/release-notes.md` there). All the packages share one version, so there is one note per Brock version: `release-notes/v<version>.md` at the repo root, titled `# Brock v<version>`.

1. Merge pull requests that carry changesets into `main`. The `release` workflow opens or updates the version pull request, "release: version packages". It runs `standards release-notes version`: `changeset version`, then a draft of `release-notes/v<version>.md` written from the new changelog entries.
2. Check out the branch of that pull request (`changeset-release/main`) and rewrite the draft for the people who use Brock: one summary paragraph, then `##` sections from the fixed list, one plain sentence per bullet. Delete the `<!-- release-notes: draft -->` line at the top.
3. Run `pnpm release-notes check` until it reports no finding, then `pnpm lint:md`. Commit the note to that branch and push.
4. Merge the version pull request. The `release` workflow checks the note again and refuses to publish while it is a draft or breaks the standard. Then it publishes the packages and creates the GitHub release `v<version>`, named after the title of the note, with the note as its body.

`pnpm release-notes current` prints the version being released. The note can be written on that branch at any point before the merge; nothing publishes without it. The workflow is `drizztdourden08/standards/.github/workflows/release.yml@v0`, so the `v0` tag of standards must point at standards 0.8.0 or later.
