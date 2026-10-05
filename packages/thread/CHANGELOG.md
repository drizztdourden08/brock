# @drizztdourden08/brock-thread

## 0.26.0

## 0.25.0

## 0.24.1

## 0.24.0

## 0.23.0

## 0.22.0

### Patch Changes

- 73a287e: In a monorepo upgrade the gate skips an app's own script when the root script of the same name already runs it in every package (`pnpm -r <script>` with no `--filter`), so lint no longer runs twice.

## 0.21.1

## 0.21.0

## 0.20.0

## 0.19.0

## 0.18.0

### Minor Changes

- 70d80cf: Brock moves to Tessera ^0.16.1 and standards ^0.7.0, which Tessera 0.16's lint extension needs. Breaking: `BackTitle` and `BackTitleProps`, `titleBarMenu`, the `focus` option of `confirmAction` and the `ConfirmFocus` type are gone, replaced by Tessera's header Back buttons, title bar dropdowns and danger dialogs; migration `shell-workarounds-removed` lists each use. StackedBar comes from the primitives, the faint text colour is gone from Brock's styles, Brock's stylesheets name no Tessera internals, and the bug report fields take the full dialog width now that Field stops at 512 px.

## 0.17.1

### Patch Changes

- 1ebfc4c: `brock upgrade` finds the app in a monorepo: the root when it holds `brock.config.ts`, else every workspace package that does, such as `apps/desktop`. It bumps the Brock ranges of the root, of each app (with its `brock.version`) and of every other workspace package that names Brock, plus the Brock entries of the `pnpm-workspace.yaml` catalog, and runs `pnpm install` when any of them changed. `brock sync` and `brock migrate` run in each app, the gate scripts run at the root and in each app, and each app gets its own `.brock/upgrade-report.md`; every path is printed. Before, the upgrade stopped at "No brock.config.ts" in a repo whose app lives in a subfolder.
- 1ebfc4c: `brock upgrade` passes each app its own `--from` and `--tessera-from`: the app's `brock.version` and `brock.tessera`, else the root's, read in the main checkout so a resumed upgrade starts from the same versions. Before, it took the Tessera start from the root and skipped the app's pin.

## 0.17.0

## 0.16.0

### Minor Changes

- 7ef6122: `brock dev`, `build` (and so `package`), `start` and the repo command's `launch` run `brock sync` first when `.brock` is missing or older than its inputs (`brock.config.ts`, `package.json`, `src/screens`, `src/widgets`, `src/boot`, `electron/boot`), so a fresh checkout that ignores `.brock` launches. `dev` and `build` stop with a message naming the missing file when `src/main.tsx` imports a `.brock` file that does not exist, instead of starting a renderer that errors and hangs. `brock sync --if-stale` is the step `launch` runs.

### Patch Changes

- 55befe4: `<repo> upgrade` writes its report to `.brock/upgrade-report.md` in the worktree instead of the tracked root, still excluded from git through `.git/info/exclude`, and prints its path. The `pr open` hint names the new path.
- 7ef6122: `worktree create` and `upgrade` start the new worktree from the local base branch when it is ahead of `origin`, instead of the older `origin/<base>`. When the two have diverged they stop and say so; `--from <ref>` still picks the start by hand.

## 0.15.0

## 0.14.0

## 0.13.0

## 0.12.0

## 0.11.0

## 0.10.0

## 0.9.0

## 0.8.1

### Patch Changes

- 03dcade: Standards moved to 0.x: Brock depends on `@drizztdourden08/standards` ^0.6.0 and calls its shared workflows at `@v0`. The family never takes a major version; `standards sync --check` now rejects a changeset that asks for one.

## 0.8.0

### Patch Changes

- 98b5318: Take standards 1.0.5, which bans tool and vendor names in prose, strings and identifiers and skips every path git ignores. Every folder that needs ignoring is a dot-folder: the repo, the app template and `brock adopt` ignore them all with `.*/`, with a `!` line per tracked dot-folder. New `brock knip` runs knip with the git-ignored paths, so it works in a worktree inside a dot-folder; the lint and deadcode scripts use it. The thread CLI finds `tools/brock-plugin-*/index.mjs` inside any top-level dot-folder instead of two named folders, and the trailer check rejects co-author lines, "generated with/by" lines and the robot emoji without naming a tool.

## 0.7.1

## 0.7.0

## 0.6.1

## 0.6.0

## 0.5.0

## 0.4.0

## 0.3.0

## 0.2.0

### Minor Changes

- e19834d: `brock migrate` replays Tessera's `RENAMES.json` after the Brock migrations: each release after `--tessera-from` (new), else `package.json#brock.tessera` (new pin), else 0.3.0, up to the installed Tessera, plus `next` when Tessera is linked to main; then it pins `brock.tessera` to the installed version. `brock migrate --tessera-from <version>` alone replays only the renames. Custom properties are renamed as whole tokens, components only where a file imports them from Tessera (the import, JSX tags and references), classes in class lists and selectors with a name boundary and longer keys first, props and prop values on the Tessera component's JSX, and literals typed with a renamed Tessera type. A value that is a note, a removed export, and a longer class built from a renamed one become numbered to-dos in the migration report; an entry whose value is also a key of its release is skipped with a warning, so a second replay changes nothing. `brock upgrade` passes the Tessera version the worktree had before its install as `--tessera-from` when the app has no pin yet.

### Patch Changes

- 1f2ce71: `brock structure` and `brock prose` run the checks of `@drizztdourden08/standards`, with Brock's extension in `brock-build/standards.extension.mjs`: `brock.config.ts` marks an app, `build/installer` and `src/screens` keep their own checks, `<id>.task.ts` is a module file. Installing `brock-build` is enough for `standards structure` to load it. Breaking: the `brock.designSystem` flag is gone; list `@drizztdourden08/standards/extensions/usage-files` in `standards.config.mjs` instead. `brock adopt` and `create-brock` take `.npmrc`, `.jscpd.json` and the knip schema from the standards templates, and the generated `eslint.config.mjs` names the `react-app` preset. `brock-thread` checks PR text with the shared writing lists from standards.
- 374cf2f: `upgrade` moves the app's Tessera to the range brock-react asks for (its catalog entry or plain spec; a linked Tessera is left alone), so an app upgraded across a Tessera release installs the Tessera its new Brock was built on. brock-react's Tessera peer range is `^0.4.0`.

## 0.1.2

### Patch Changes

- @drizztdourden08/brock-lint-config@0.1.2

## 0.1.1

### Patch Changes

- 0a52cd7: The gaps the first Archipelia app found, now in Brock. `product.ports` gives each app a port block, each thread worktree a slot of its own and the dev server `strictPort`; `create-brock` writes the base. `brock adopt` writes the knip entries and the `.gitignore` lines for generated outputs. `brock check` and `brock sync` run per app at a workspace root. `launchAppForTest` from `brock-build/testing` starts the built app headless for app e2e tests. New helpers: `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard`, `redactSecrets` and `lanAddresses()` with the `network:lanAddresses` channel.
- 568c900: An app on another Windows drive than its linked Brock checkout keeps its links: `create-brock --local`, `brock add --local`, `brock adopt --local` and `upgrade --local` add `prefer-frozen-lockfile=false` to `.npmrc` (and `pnpm-lock.yaml text eol=lf` to `.gitattributes`) when a `link:` spec crosses drives, so later installs resolve the links instead of joining `X:/...` to the app folder.
- f6a334e: A scaffolded app is a git repository with its first commit, `launch main` runs the main checkout, and the closing steps name the app's own command.
- 8dec315: `launch` refreshes the app's brand logos first, so a fresh worktree reviews clean, and `worktree remove` retries a directory Windows still holds, like `finish`.
- 8498845: Platforms are separate ids (windows, macos, linux, android, web, with ios reserved) and bundles (desktop, mobile) in `targets`. Each one is a strategy with doctor checks, scaffold steps, CI and release jobs and secrets. `brock sync` composes `ci.yml` (lint, structure, tests and the headless review on Linux) and `release.yml` from them. create-brock asks for the platforms or takes `--platforms`; `platform add`, `remove` and `list`, `doctor` and `web build` are new commands. Android gets a Capacitor project in `mobile/android` with signing from the environment, `mobile build --release` and `mobile keystore`; Linux debs install module udev rules.
- d78f430: The release verb's source is tracked in the repo; the ignore rule for installer output no longer matches it.
- a8a87be: Apps update and ship the way Relic of the Past does. The update dialog no longer opens by itself: a found update shows as a badge on a version tag in the title bar, which modules reach through the new `RendererModule.titleBar` slot. `brock package` builds the app tree, the Windows installer with the app icon and a splash, and the Velopack update packages. `create-brock` and `brock adopt` write a release workflow that packages every platform and publishes to GitHub Releases with `release-notes/v<version>.md` as the body, and `brock release` dispatches it.
- 97496b7: Apps pin Brock once in `package.json#brock.version`, and sync, adopt and create-brock keep every Brock dependency on it. `brock migrate` runs the migrations Brock packages ship, and `<app> upgrade [version] [--check] [--no-review]` moves an app to a release in its own worktree, proves it with the gate and the headless review, and commits when green. Breaking: BrockApp no longer takes logoSrc or instanceLogoSrc (migration brock-app-logo-src), a non-boolean setting row needs a control (migration base-setting-controls), the built-in About menu entry replaces an app's own (migration menu-built-in-about), and .gitignore gains the files newer Brock generates (migration gitignore-generated-files).
- Updated dependencies [068a02d]
- Updated dependencies [b1fa12d]
- Updated dependencies [14c3674]
  - @drizztdourden08/brock-lint-config@0.1.1
