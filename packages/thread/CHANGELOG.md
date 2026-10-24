# @drizztdourden08/brock-thread

## 0.89.0

## 0.88.1

## 0.88.0

## 0.87.2

## 0.87.1

### Patch Changes

- b079114: Fix the duplicate copy of standards in a repo that is ahead of Brock. These packages asked for standards `^0.11`, so a repo on standards `^0.12` got two copies and `standards sync` failed with "Cannot redefine plugin". The range is now `>=0.11.0 <1`, so the one copy a repo installs satisfies every Brock package.

## 0.87.0

## 0.86.0

### Minor Changes

- 2bc3e29: Any repo with a `brock.workspace.mjs` can get its own command from brock-thread alone. brock-thread gains a `brock-thread` bin with `brock-thread link [--force]`, which installs the launcher `bin/<name>.mjs`, the `bin` entry and the `postinstall` for the workspace `name`, and `brock-thread <verb>` for the thread verbs. The launcher, its template, `installLauncher`, `launcherName` and `launcherSource` moved from brock-build to brock-thread, which brock-build now imports, so `adopt`, `create-brock` and `sync` write the same file as before. A repo that already has a command of that name, such as `tessera`, keeps it: `link` leaves its `package.json` alone and checks that its file forwards the thread verbs with `runThreadCli(argv)`, new in `@drizztdourden08/brock-thread/cli` beside `runThread` and `threadVerbNames`. It returns null for a word that is not a thread word, so the repo's own command handles it.

## 0.85.0

## 0.84.0

## 0.83.0

### Minor Changes

- 495cd91: The server app kind builds. `server` is a new platform in `targets`: `targets: ['server']` is a windowless app, `['desktop', 'server']` ships both. `server.entry` in brock.config.ts names the entry, default `server/main.ts`. `brock server build` bundles it with Vite SSR into `dist/server/main.mjs`, one Node file with every dependency inlined, the app's `build.aliases` and `build.define` applied, and `brock server dev` rebuilds on change and restarts it with `node --watch`; anything after `--` reaches the app. The bundle refuses an `electron` import and a native `.node` addon (and the `bindings` and `node-gyp-build` loaders) with a clear error. The helper bundle now calls the same Node bundle config, and its output is unchanged. `brock build` builds the server for a server app and both builds for a desktop plus server app, and `brock build --if-stale` checks `dist/server/main.mjs` and the `server` folder. A windowless app gets none of the Electron or renderer managed files (electron.vite.config.ts, electron-builder.config.cjs, the boot, handler, review, screen, widget, title bar, tour and start-up lists, the palette and the module lists but the manifest) and none of the installer or screen checks; `brock dev` on it points at `brock server dev`. The managed tsconfig.json now includes `server`, so every app's tsconfig changes on its next `brock sync`. In thread, `serverTarget({ app, userData, states })` is a launch target: dev runs `brock server dev`, `--prod` runs `brock build --if-stale` then `node dist/server/main.mjs --user-data=<dir>`, output piped, and only the state `none` unless a states hook is given.

## 0.82.0

## 0.81.0

## 0.80.0

## 0.79.0

## 0.78.0

## 0.77.0

## 0.76.0

## 0.75.0

## 0.74.1

## 0.74.0

## 0.73.0

## 0.72.0

## 0.71.1

## 0.71.0

## 0.70.0

## 0.69.0

## 0.68.6

## 0.68.5

## 0.68.4

## 0.68.3

## 0.68.2

## 0.68.1

## 0.68.0

## 0.67.0

## 0.66.0

## 0.65.0

## 0.64.0

## 0.63.0

## 0.62.0

## 0.61.0

## 0.60.1

## 0.60.0

## 0.59.0

## 0.58.0

## 0.57.0

## 0.56.0

## 0.55.0

## 0.54.0

## 0.53.0

## 0.52.1

## 0.52.0

## 0.51.1

## 0.51.0

## 0.50.0

## 0.49.0

## 0.48.0

## 0.47.0

## 0.46.0

## 0.45.1

## 0.45.0

### Patch Changes

- 63cb77f: A plugin that `brock.workspace.mjs` lists as an object (the imported `definePlugin` result) now loads once: discovery skips a declared `brock-plugin-*` package or a dot-folder plugin whose name matches a plugin already loaded, so its verbs and workflow steps are no longer counted twice.

## 0.44.0

## 0.43.0

## 0.42.0

## 0.41.0

## 0.40.0

## 0.39.0

### Minor Changes

- 472754d: An app adds its own steps to the managed CI and release workflows in `brock.config.ts`, `workflows.steps`, so `brock sync`, `brock build` and `platform add` keep them. Steps go in at fixed points: `ci.beforeInstall`, `ci.beforeBuild`, `ci.afterBuild` and `ci.beforeTest`, and `release.beforeInstall`, `release.beforePackage` and `release.afterPackage` (a file copied into `upload/` there ships with the release). A step takes `run` or `uses` (with `with`), `env`, `if`, `shell`, the repository `secrets` it reads (each set as an environment variable of the step), and `os` and `platforms` to keep it to some runners or platform jobs. Modules (`brock.workflows` in their manifest) and the repo command's plugins (`definePlugin({ workflows })`) add steps the same way, before the app's. `workflows: { ci: 'own' }` or `{ release: 'own' }` leaves that file to the app: `brock sync` stops writing it and `brock check` stops comparing it.
- bcd0321: In a repo of several apps the shared workspace `ci.yml` runs the steps of every app, in workspace order, each named `<app>: <step>`, a shell step with `working-directory` and `APP_DIR` set to its app, and the plugins' steps once. `workflows: { ci: 'own' }` in `brock.workspace.mjs` leaves that shared file to the repo; an app's own `workflows` setting covers only its own files. A `uses` step of the same action, version and inputs runs once per job, however many apps or modules declare it.

### Patch Changes

- cbe389d: The step table of `.brock/upgrade-report.md` lists every gate step the upgrade runs, `brock check` and `lint:md` included: a step after a failed one shows as not run, where the table stopped at the failure before.

## 0.38.0

### Patch Changes

- 3387134: Standards 0.9: list names that must keep their exact spelling in the prose allow list (they now pass the identifier rule too), and a test may assert the real text its app shows.

## 0.37.0

### Minor Changes

- 38244b2: A production launch reviews the current sources. `brock build --if-stale` builds only when `dist` is missing, half built or older than the app's sources (its own and those of the workspace packages it depends on), and `launch --prod` (with `--review` too) runs it first instead of reusing whatever `dist` holds.

### Patch Changes

- 38244b2: `<repo> upgrade` runs the documented gate in full, as CI does: `pnpm install --frozen-lockfile` and `brock check` in each app after the sync and the migrations, then `lint`, `typecheck`, `lint:md`, `structure` and `test` at the root and in each app, then `brock gate` in each app.

## 0.36.0

### Minor Changes

- 5a819b6: An app adds its own checks to the gate with `gate.scripts` in `brock.config.ts`: `package.json` scripts, taken from the app's `package.json` when it has the script, else from the workspace root's, and a script neither declares fails. `brock gate` runs them in order (after the C format check of `gate.clangFormat`), runs every step even after a failure, and exits 1 naming the ones that failed; an app that declares none passes. The managed CI `quality` job of each app (standalone or in a workspace) runs `brock gate` after the release note check, and `<repo> upgrade` runs it in each app after the gate scripts.
- b8f4eed: `<app> linux push` builds the Linux AppImage in a VirtualBox VM, or in WSL and copies it in, installs its desktop entry, pins it to the dock and launches it on the VM's desktop. `<app> linux doctor` checks the ssh client, VirtualBox, the VM and its state, key-only SSH access, the Guest Additions and the build tools, and `<app> linux init` writes this machine's `~/.brock/linux/<repo>.json` and prints the one-time VM steps. The machine file never holds a password: a password-like key stops the command and every ssh call runs with `BatchMode=yes`. `linux` in `brock.workspace.mjs` sets the app, the build command, the artifact folder, extra shared folders and the launch flags.
- 0aaabeb: Brock depends on `@drizztdourden08/standards` ^0.8.0, and `brock-thread` drops its copy of the release note checker for `@drizztdourden08/standards/release-notes`: `checkReleaseNote` is the standards function, and `checkNoteFile` runs its `checkRepoNotes` for the version named, so `brock release` and `brock release-notes check` also hold every newer note in the repo to the standard.
- b42b735: The release note standard reaches Brock: every release has `release-notes/v<version>.md` at the repo root, with a `# <Product> v<version>` title, a one-paragraph summary, `##` sections from a fixed list and plain-English bullets (`docs/release-notes.md` in `@drizztdourden08/standards` holds the rules; `docs/architecture.md` and `docs/app-structure.md` describe them for apps). `brock-thread` exports `checkReleaseNote(text, { version, product?, sections?, words? })` and `checkNoteFile({ rootDir, version, product?, sections? })`, and `brock release` refuses a note that does not pass before it dispatches.
- 1ba51ae: The review compares its screenshots with stored baselines. `--review --review-bless` stores each capture as `tests/baselines/<platform>/<capture>.png` in the app repo, named after its step without the number, and refuses while any other check of the run failed, naming them (`--force` blesses anyway); `--review --review-baselines` compares every capture with its baseline and fails the review on any differing pixel, a missing baseline, a size change or a baseline no capture used, with a diff image per failure under `diffs/` in the report folder and the results in a Baselines section of `report.md` and under `baselines` in `report.json`. `tests/baselines/baselines.json` takes a tolerance (share of pixels), a channel threshold and masks (rectangles or CSS selectors) for every capture or per capture, and any element with `data-review-mask` is masked; brock-core exports `REVIEW_MASK` to spread it. Brock masks the text it writes that changes on every run: the performance widget's values, the profiles' last-used time, the job dialog line and title bar status, the Storage page sizes and path, and the logs widget's time column. A baseline run pins device scale 1, software rendering on one raster thread, no LCD text, sRGB, reduced motion, no caret, the default window size, a fixed 1920 by 1080 area for cluster maximize and full screen, and no worktree instance name; each capture finishes running animations and waits for two equal captures in a row. `launch` gives a baseline run an emptied `.user-data-review` folder, and without `--target` launches the app whose folder it runs in. `review: { baselines: true }` in `brock.config.ts` makes the managed CI review job compare with the `linux` set on `ubuntu-24.04` under a fixed 1920x1080x24 xvfb screen, and adds a `bless` input that uploads a fresh set as the `review-baselines` artifact; in a workspace with several apps each app's `ci-<app>.yml` gets its own, with the artifact `review-baselines-<app>`.

  `cluster-fullscreen` has a built-in rule, a channel threshold of 8 with no pixel share, since Chromium rasterises its SVG icons and drop shadow slightly differently after the full screen resize; an app's own rule for it overrides it. The managed CI review job now uploads the report from `.user-data/Data/review/` at the repo root, where `launch` writes it, instead of `<app folder>/.user-data`, which found nothing for an app in a folder of a workspace; `brock sync` rewrites the line.

- 7fc554a: Each worktree has its own base branch, so a repo can run a whole migration on an integration branch while its main branch keeps moving. `worktree create --base <branch>` sets it and starts the worktree there; a `--from` that names an origin branch makes that branch the base unless `--base` says otherwise. The base is stored in git config as `branch.<branch>.brockBase`, so it follows the branch through `finish`, a resume and a rename, and goes with `git branch -D`. `refresh --rebase` rebases on it, `pr open` opens the PR into it, `pr status` says when the PR targets another branch, and `finish` and `remove` treat the branch as landed once its commits are on the base, then delete it instead of leaving it behind. `worktree base [name] [<new base>]` shows or changes it. A branch that another branch names as its base is never deleted with a worktree. A worktree made before this has no entry and keeps the workspace base; after a fresh clone, resuming a branch takes the base of its open PR.

### Patch Changes

- 34ef26d: The thread README lists `--skip-install` on `worktree create`: the worktree is added and provisioned with no `pnpm install`, for a thread that only writes a file such as a release note. A new page, `docs/launch-suite.md`, says how an app keeps its launch suite (`tests/launch-suite.md`, a numbered table of cases per group, each confirmed by the owner or from output, run in one pass in a fresh worktree), its kept end-to-end tests (`tests/e2e/<name>.e2e.ts`) and its coverage registry (`tests/COVERAGE.md`).
- e40fe59: Examples name no app of their own. `defineProduct`'s message for a file extension written with a dot gives `mypack` as its example, the package READMEs use neutral names (`my-app`, `api-token`, an `account` sign-in, `codegen:check` as a gate script), and the move steps in docs/upgrading-an-app.md are a general checklist.
- e40fe59: `worktree commit` and `pr open` no longer refuse a message that carries one app's commit hook marker. That marker meant something only in the repo whose hook reads it, so a repo that wants the refusal keeps it in its own hook. The attribution and co-author check stays.

## 0.35.0

## 0.34.0

### Patch Changes

- 08e0cd1: A dev launch (the review's included) leaves `dist/electron/main.js` without a built renderer, and a later `brock start` opened a blank window. `brock start` now spots that half build (no `dist/renderer/index.html`, or one older than main) and runs `brock build` first. `launchAppForTest` and `assertLaunchable` throw with the reason instead of opening a blank window, and `launch --prod` refuses with it.

## 0.33.0

## 0.32.1

## 0.32.0

## 0.31.0

## 0.30.0

## 0.29.1

## 0.29.0

## 0.28.1

## 0.28.0

## 0.27.0

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
