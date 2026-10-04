# @drizztdourden08/create-brock

## 0.8.0

### Patch Changes

- 98b5318: Take standards 1.0.5, which bans tool and vendor names in prose, strings and identifiers and skips every path git ignores. Every folder that needs ignoring is a dot-folder: the repo, the app template and `brock adopt` ignore them all with `.*/`, with a `!` line per tracked dot-folder. New `brock knip` runs knip with the git-ignored paths, so it works in a worktree inside a dot-folder; the lint and deadcode scripts use it. The thread CLI finds `tools/brock-plugin-*/index.mjs` inside any top-level dot-folder instead of two named folders, and the trailer check rejects co-author lines, "generated with/by" lines and the robot emoji without naming a tool.
- Updated dependencies [98b5318]
  - @drizztdourden08/brock-build@0.8.0

## 0.7.1

### Patch Changes

- @drizztdourden08/brock-build@0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [f6cfba5]
- Updated dependencies [f6cfba5]
  - @drizztdourden08/brock-build@0.7.0

## 0.6.1

### Patch Changes

- @drizztdourden08/brock-build@0.6.1

## 0.6.0

### Patch Changes

- @drizztdourden08/brock-build@0.6.0

## 0.5.0

### Patch Changes

- @drizztdourden08/brock-build@0.5.0

## 0.4.0

### Patch Changes

- Updated dependencies [f90c7ee]
  - @drizztdourden08/brock-build@0.4.0

## 0.3.0

### Patch Changes

- @drizztdourden08/brock-build@0.3.0

## 0.2.0

### Minor Changes

- becd8b0: Brock reads the app layout from `tessera.config.json`. The splash look, the splash token sheet and the installer take the app theme from `theme.css` of that file (with the app's `apps` entry merged in), through the app's own `@drizztdourden08/tessera/config`, and keep `src/theme.css` when there is no file or the installed Tessera has no config entry; a file that breaks the schema stops with an error naming it. `appThemeCss(rootDir)` is the new `@drizztdourden08/brock-build/theme` entry, and the managed `stylelint.config.mjs` takes its token file from it. A new app carries a root `tessera.config.json` with `$schema` alone. `brock adopt` writes one when it is missing: `$schema` alone for a single app, `package`, `parts` and one `apps` entry per app when the repo has `packages/design`.

### Patch Changes

- 1f2ce71: `brock structure` and `brock prose` run the checks of `@drizztdourden08/standards`, with Brock's extension in `brock-build/standards.extension.mjs`: `brock.config.ts` marks an app, `build/installer` and `src/screens` keep their own checks, `<id>.task.ts` is a module file. Installing `brock-build` is enough for `standards structure` to load it. Breaking: the `brock.designSystem` flag is gone; list `@drizztdourden08/standards/extensions/usage-files` in `standards.config.mjs` instead. `brock adopt` and `create-brock` take `.npmrc`, `.jscpd.json` and the knip schema from the standards templates, and the generated `eslint.config.mjs` names the `react-app` preset. `brock-thread` checks PR text with the shared writing lists from standards.
- Brock takes Tessera 0.4.0: SectionNav is SideNav and HeaderTabs is HeaderAnchorNav (replayed with Brock's own Tessera renames step), the title bar menu, the fixed-head search results and the config loader are the published ones.

  New apps' knip ignores `@drizztdourden08/standards`, whose stylelint plugins it sees through brock-lint-config; the `standards-lint-deps` upgrade step does the same for an existing app and drops `typescript-eslint` and `eslint-plugin-react-hooks`, which standards now carries.

- Updated dependencies [ee89ad0]
- Updated dependencies [becd8b0]
- Updated dependencies [1f2ce71]
- Updated dependencies
- Updated dependencies [becd8b0]
- Updated dependencies [f818087]
- Updated dependencies [e19834d]
  - @drizztdourden08/brock-build@0.2.0

## 0.1.2

### Patch Changes

- 567636a: `--tessera registry` keeps the published Tessera while `--local` links Brock, so an app is not tied to a Tessera working copy that is being edited.
- Updated dependencies [7f38965]
  - @drizztdourden08/brock-build@0.1.2

## 0.1.1

### Patch Changes

- 0a52cd7: The gaps the first Archipelia app found, now in Brock. `product.ports` gives each app a port block, each thread worktree a slot of its own and the dev server `strictPort`; `create-brock` writes the base. `brock adopt` writes the knip entries and the `.gitignore` lines for generated outputs. `brock check` and `brock sync` run per app at a workspace root. `launchAppForTest` from `brock-build/testing` starts the built app headless for app e2e tests. New helpers: `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard`, `redactSecrets` and `lanAddresses()` with the `network:lanAddresses` channel.
- 568c900: An app on another Windows drive than its linked Brock checkout keeps its links: `create-brock --local`, `brock add --local`, `brock adopt --local` and `upgrade --local` add `prefer-frozen-lockfile=false` to `.npmrc` (and `pnpm-lock.yaml text eol=lf` to `.gitattributes`) when a `link:` spec crosses drives, so later installs resolve the links instead of joining `X:/...` to the app folder.
- f6a334e: A scaffolded app is a git repository with its first commit, `launch main` runs the main checkout, and the closing steps name the app's own command.
- c1c29a0: The repo command runs Brock in its own checkout when called from outside it, and a worktree install no longer rewrites the machine shims. Scaffolded and adopted apps route the scope to GitHub Packages in their .npmrc.
- 8498845: Platforms are separate ids (windows, macos, linux, android, web, with ios reserved) and bundles (desktop, mobile) in `targets`. Each one is a strategy with doctor checks, scaffold steps, CI and release jobs and secrets. `brock sync` composes `ci.yml` (lint, structure, tests and the headless review on Linux) and `release.yml` from them. create-brock asks for the platforms or takes `--platforms`; `platform add`, `remove` and `list`, `doctor` and `web build` are new commands. Android gets a Capacitor project in `mobile/android` with signing from the environment, `mobile build --release` and `mobile keystore`; Linux debs install module udev rules.
- 068a02d: Screens by convention: files in src/screens become bucket hubs, pages, tabs, settings pages, cards and custom screens through a generated .brock/screens.ts, with the menu, bucket switch, Escape home and settings placement read from screens.config.ts. brock structure checks the layout, the review opens every generated screen, and the template app uses it.
- b1fa12d: Breaking: a full-bleed screen at the root of src/screens is now `<id>.layer.tsx`, and `<page>.custom.tsx` names a custom page inside a bucket; migration custom-layer-rename renames each root `.custom.tsx` and lists it in the report, and knip-custom-pages adds custom pages to the knip entries. Search now reads one index for the palette and every hub: `brock sync` and the dev server write `.brock/search.ts` from the screens, their `meta.keywords`, the settings rows and each custom page's `searchEntries`, without loading any page, and modules, widgets, the menu, actions and `useSearchEntries` join at runtime. Generated hubs have search on, grouped by page, Ctrl+K inside a hub focuses it, a result opens its page and flashes its row, `brock structure` fails a custom page without `searchEntries` and counts them per bucket, and the review searches a sample from each source in the palette and in a hub.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- a8a87be: Apps update and ship the way Relic of the Past does. The update dialog no longer opens by itself: a found update shows as a badge on a version tag in the title bar, which modules reach through the new `RendererModule.titleBar` slot. `brock package` builds the app tree, the Windows installer with the app icon and a splash, and the Velopack update packages. `create-brock` and `brock adopt` write a release workflow that packages every platform and publishes to GitHub Releases with `release-notes/v<version>.md` as the body, and `brock release` dispatches it.
- e2cf0ee: Every new app starts with the updater: create-brock records it and adds the module and its velopack peer in registry and local link mode. The title bar drops the permanent version tag and shows an "Update available" badge only when an update is found, the update dialog follows the reference layout and says plainly when the app has no update source, and the review tool checks the menu entry, the dialog and its Escape.
- 97496b7: Apps pin Brock once in `package.json#brock.version`, and sync, adopt and create-brock keep every Brock dependency on it. `brock migrate` runs the migrations Brock packages ship, and `<app> upgrade [version] [--check] [--no-review]` moves an app to a release in its own worktree, proves it with the gate and the headless review, and commits when green. Breaking: BrockApp no longer takes logoSrc or instanceLogoSrc (migration brock-app-logo-src), a non-boolean setting row needs a control (migration base-setting-controls), the built-in About menu entry replaces an app's own (migration menu-built-in-about), and .gitignore gains the files newer Brock generates (migration gitignore-generated-files).
- Updated dependencies [0a52cd7]
- Updated dependencies [568c900]
- Updated dependencies [ade72f8]
- Updated dependencies [9a08468]
- Updated dependencies [49968cd]
- Updated dependencies [c48024b]
- Updated dependencies [3680727]
- Updated dependencies [e406f70]
- Updated dependencies [fd0a736]
- Updated dependencies [be862b2]
- Updated dependencies [c1c29a0]
- Updated dependencies [bdde234]
- Updated dependencies [8498845]
- Updated dependencies [f62f048]
- Updated dependencies [068a02d]
- Updated dependencies [b1fa12d]
- Updated dependencies [ae6b8e2]
- Updated dependencies [14c3674]
- Updated dependencies [2cc7040]
- Updated dependencies [a8a87be]
- Updated dependencies [e2cf0ee]
- Updated dependencies [97496b7]
  - @drizztdourden08/brock-build@0.1.1
