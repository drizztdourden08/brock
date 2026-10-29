# @drizztdourden08/brock-build

## 0.115.5

### Patch Changes

- @drizztdourden08/brock-core@0.115.5
- @drizztdourden08/brock-lint-config@0.115.5
- @drizztdourden08/brock-thread@0.115.5

## 0.115.4

### Patch Changes

- @drizztdourden08/brock-core@0.115.4
- @drizztdourden08/brock-lint-config@0.115.4
- @drizztdourden08/brock-thread@0.115.4

## 0.115.3

### Patch Changes

- Updated dependencies [67fa480]
  - @drizztdourden08/brock-thread@0.115.3
  - @drizztdourden08/brock-core@0.115.3
  - @drizztdourden08/brock-lint-config@0.115.3

## 0.115.2

### Patch Changes

- @drizztdourden08/brock-core@0.115.2
- @drizztdourden08/brock-lint-config@0.115.2
- @drizztdourden08/brock-thread@0.115.2

## 0.115.1

### Patch Changes

- Updated dependencies [aeb8775]
  - @drizztdourden08/brock-thread@0.115.1
  - @drizztdourden08/brock-core@0.115.1
  - @drizztdourden08/brock-lint-config@0.115.1

## 0.115.0

### Patch Changes

- @drizztdourden08/brock-core@0.115.0
- @drizztdourden08/brock-lint-config@0.115.0
- @drizztdourden08/brock-thread@0.115.0

## 0.114.0

### Patch Changes

- 5dbde6f: `brock lint` on the whole tree now runs eslint in batches of 1000 files, one process after the other, and exits with the worst code of all batches. The memory of a run no longer grows with the tree, which fixes the out of memory crash of the full-tree lint in CI. Each batch gets a 4096 MB heap ceiling (it was 2048 MB for the whole run), and each keeps its own cache file. A changed-files run and a run on named files stay one process at 2048 MB. `BROCK_LINT_BATCH_SIZE` sets another batch size, `BROCK_LINT_MEMORY_MB` and a heap flag in `NODE_OPTIONS` still win, and `BROCK_LINT_STATS=1` prints each batch's peak memory.
- Updated dependencies [4632077]
- Updated dependencies [b14e0f1]
  - @drizztdourden08/brock-core@0.114.0
  - @drizztdourden08/brock-thread@0.114.0
  - @drizztdourden08/brock-lint-config@0.114.0

## 0.113.0

### Patch Changes

- Updated dependencies [230f42b]
- Updated dependencies [f9645ba]
  - @drizztdourden08/brock-core@0.113.0
  - @drizztdourden08/brock-lint-config@0.113.0
  - @drizztdourden08/brock-thread@0.113.0

## 0.112.0

### Patch Changes

- @drizztdourden08/brock-core@0.112.0
- @drizztdourden08/brock-lint-config@0.112.0
- @drizztdourden08/brock-thread@0.112.0

## 0.111.0

### Patch Changes

- @drizztdourden08/brock-core@0.111.0
- @drizztdourden08/brock-lint-config@0.111.0
- @drizztdourden08/brock-thread@0.111.0

## 0.110.0

### Patch Changes

- Updated dependencies [28179da]
  - @drizztdourden08/brock-core@0.110.0
  - @drizztdourden08/brock-lint-config@0.110.0
  - @drizztdourden08/brock-thread@0.110.0

## 0.109.1

### Patch Changes

- Updated dependencies [d97ed8a]
  - @drizztdourden08/brock-lint-config@0.109.1
  - @drizztdourden08/brock-core@0.109.1
  - @drizztdourden08/brock-thread@0.109.1

## 0.109.0

### Patch Changes

- @drizztdourden08/brock-core@0.109.0
- @drizztdourden08/brock-lint-config@0.109.0
- @drizztdourden08/brock-thread@0.109.0

## 0.108.0

### Minor Changes

- 946f26b: The renderer dev server pre-bundles the Brock packages an app links from outside its workspace, such as a Brock checkout linked with `link:`, so a dev start loads a few chunks instead of about 1,900 source files. A stamp of the files those packages carry goes into the optimizer hash, so a branch switch or an edit there re-bundles them on the next start. `build.optimizeDeps.liveBrock: true`, `brock dev --live-brock` or `BROCK_LIVE_BROCK=1` keeps them as source with hot reload.

### Patch Changes

- b0c03a0: A dev app now stops at once when the interface fails to load, for example on a module error after a Tessera mismatch. The splash shows the error with Open logs, Retry and Quit instead of waiting 120 s for the watchdog. Launch, dev, build and start also stop with one clear line when the app's Tessera does not fit what brock-react needs, and brock doctor checks the same.
- 6421d65: A dev start skips work it did before. Main and preload are not bundled again while no module file they read, the config or the install changed (`node_modules/.vite/brock-build-reuse`), which saves 2 to 4 s on a warm start. A new worktree with the same lockfile copies the Vite dependency cache that another worktree made, from `~/.brock/cache/vite-deps`, so its first start skips the dependency optimizer. `launch` now runs the sync in its own process instead of a child, and the cold-start Tessera guide runs after the app is spawned instead of before. `brock sync --if-stale` on an app that is already in sync no longer loads the whole CLI or the app config: it checks a few file stamps and a record of the last brand icon copy, which takes well under a second. `brock sync`, `brock sync --check` and `brock build` behave as before.
- Updated dependencies [6421d65]
- Updated dependencies [caf5a4f]
  - @drizztdourden08/brock-thread@0.108.0
  - @drizztdourden08/brock-core@0.108.0
  - @drizztdourden08/brock-lint-config@0.108.0

## 0.107.1

### Patch Changes

- @drizztdourden08/brock-core@0.107.1
- @drizztdourden08/brock-lint-config@0.107.1
- @drizztdourden08/brock-thread@0.107.1

## 0.107.0

### Patch Changes

- 4aeb198: A dev start does less work twice. The renderer dependency crawl is kept in `node_modules/.vite/brock-renderer-deps.json` and reused while no file it read changed, which saves about 1 to 2 s on a warm start and more on a cold disk. `brock sync --if-stale` now copies the brand icons that changed, so `launch` runs one Brock process before the dev server instead of two and no longer redraws the Setup splash, which only `brock package` needs.
- Updated dependencies [4aeb198]
- Updated dependencies [77e2dfe]
  - @drizztdourden08/brock-thread@0.107.0
  - @drizztdourden08/brock-core@0.107.0
  - @drizztdourden08/brock-lint-config@0.107.0

## 0.106.2

### Patch Changes

- @drizztdourden08/brock-core@0.106.2
- @drizztdourden08/brock-lint-config@0.106.2
- @drizztdourden08/brock-thread@0.106.2

## 0.106.1

### Patch Changes

- a264149: `brock sync --check` now checks the committed `guide.parts` file. It runs `tessera guide`, compares the file it writes with the committed one (CRLF against LF does not count), names the file when it differs and tells you to run `brock sync`, then puts the committed file back. Before, only `brock sync` and `brock build` wrote that file, so a stale one passed the check and showed up as a dirty tree after the next build.
  - @drizztdourden08/brock-core@0.106.1
  - @drizztdourden08/brock-lint-config@0.106.1
  - @drizztdourden08/brock-thread@0.106.1

## 0.106.0

### Minor Changes

- af32761: Add a cargo lane to `brock gate`. While a `Cargo.toml` with a `[workspace]` or `[package]` table sits at the repo root, the gate checks the Rust comments, then runs `cargo fmt --all -- --check`, `cargo clippy --workspace --all-targets` and `cargo test --workspace`, each reported like the other steps. Clippy runs with `-D warnings` and with the `too_many_lines` and `cognitive_complexity` lints on, held to 60 lines and a complexity of 10 by a `clippy.toml` that Brock applies when the repo has none of its own. The comment check fails any `//` or `/* */` comment in a `.rs` file with its `file:line`, and allows `///`, `//!` and a `// SAFETY:` line directly above `unsafe`. A missing cargo fails the lane with a clear message. `gate.cargo` turns the lane off (`enabled: false`), moves it (`path`) or adds clippy flags (`clippyArgs`). A repo with no Brock app can now run `brock gate`: it reads `gate` from `brock.workspace.mjs`, or runs the cargo lane alone when the root has a `Cargo.toml`.
- a5e8521: `defineBrockSite` takes `build.routes`, a list of `{ path, title, description? }`. After the Vite build, each route gets a copy of `dist/index.html` at `dist/<path>/index.html` with its own `<title>`, `<meta name="description">`, `og:title` and `og:description` (the Open Graph tags are changed only where the page already has them). Static hosts such as GitHub Pages serve `/privacy/` only when that file exists, so a single-page site no longer answers 404 on its legal pages. A path is letters, digits and dashes in segments split by `/`, with no leading or trailing slash and no dots; a bad or repeated path fails the build with a message naming the route. Title and description are escaped as HTML text. Asset URLs stay valid from the nested folder: absolute and base-prefixed URLs are kept, and a relative base (`./`) is rewritten to climb out of the folder. A site with no routes builds as before.

### Patch Changes

- Updated dependencies [af32761]
- Updated dependencies [00e4059]
  - @drizztdourden08/brock-thread@0.106.0
  - @drizztdourden08/brock-lint-config@0.106.0
  - @drizztdourden08/brock-core@0.106.0

## 0.105.0

### Patch Changes

- ce76906: `defineBrockVitestConfig` works from a workspace root. It takes react, react-dom, zustand and Tessera, and the JSX runtime, from the app that has them (`{ appDir }` as the third argument, else the root when it holds a `brock.config.ts`, else the first workspace package that depends on brock-react), and leaves out a shared package that is not installed. A single app is unchanged.
- Updated dependencies [e345020]
- Updated dependencies [bfb285b]
  - @drizztdourden08/brock-core@0.105.0
  - @drizztdourden08/brock-thread@0.105.0
  - @drizztdourden08/brock-lint-config@0.105.0

## 0.104.0

### Patch Changes

- e1ce954: An app test can import brock-react again. `@drizztdourden08/brock-build/vitest` exports `defineBrockVitestConfig`, which sets the automatic JSX runtime and compiles every `@drizztdourden08/*` package instead of loading it as is, and `brock sync` writes it as a managed `vitest.config.ts` for an app with a `test` script. A `vitest.config.ts` you wrote yourself is left alone; wrap it in the factory. Run `brock sync` after updating.
- Updated dependencies [632c810]
- Updated dependencies [6e3ed14]
  - @drizztdourden08/brock-core@0.104.0
  - @drizztdourden08/brock-lint-config@0.104.0
  - @drizztdourden08/brock-thread@0.104.0

## 0.103.0

### Patch Changes

- @drizztdourden08/brock-core@0.103.0
- @drizztdourden08/brock-lint-config@0.103.0
- @drizztdourden08/brock-thread@0.103.0

## 0.102.0

### Patch Changes

- @drizztdourden08/brock-core@0.102.0
- @drizztdourden08/brock-lint-config@0.102.0
- @drizztdourden08/brock-thread@0.102.0

## 0.101.0

### Minor Changes

- 8ae4d79: New `brock lint` runs eslint cheaply. A local run lints only the files changed since the merge base with the default branch, uncommitted and untracked files included. CI or `--all` lints the whole tree, `--changed` forces the changed mode, and files named on the command line lint just those. A changed eslint, tsconfig, package or lint-config file lints the whole tree. The first line says which mode ran and how many files. Local runs use eslint's content cache under `node_modules/.cache/brock` (`--no-cache` skips it, CI never uses it). The eslint child and `brock knip` start with `--max-old-space-size=2048` in `NODE_OPTIONS`, set `BROCK_LINT_MEMORY_MB` for another size; a heap flag you already set wins. `brock adopt`, the app template and the server template now use `brock lint` in the `lint` script instead of `eslint .`.

### Patch Changes

- Updated dependencies [b0d5e5e]
  - @drizztdourden08/brock-core@0.101.0
  - @drizztdourden08/brock-lint-config@0.101.0
  - @drizztdourden08/brock-thread@0.101.0

## 0.100.0

### Minor Changes

- e24df4e: Search now finds a page by the keywords of its meta for every kind of page, and a page can declare rows of its own. A module settings page was left out of the index, and the hub page list dropped the keywords of a built-in page. Both are fixed. A new `searchRows` field in the page meta, a list of `{ label, keywords?, anchor? }`, adds one result per row: it opens the page and, with an anchor, scrolls to that element. `brock structure --check` now reports a `keywords` or `searchRows` value in a page meta that the build cannot read as a literal.

### Patch Changes

- @drizztdourden08/brock-core@0.100.0
- @drizztdourden08/brock-lint-config@0.100.0
- @drizztdourden08/brock-thread@0.100.0

## 0.99.0

### Patch Changes

- Updated dependencies [6ee68c2]
  - @drizztdourden08/brock-thread@0.99.0
  - @drizztdourden08/brock-core@0.99.0
  - @drizztdourden08/brock-lint-config@0.99.0

## 0.98.0

### Patch Changes

- @drizztdourden08/brock-core@0.98.0
- @drizztdourden08/brock-lint-config@0.98.0
- @drizztdourden08/brock-thread@0.98.0

## 0.97.2

### Patch Changes

- e7fe0aa: The `ControllerSilhouette` component comes from Tessera again, and the module no longer carries a copy of it. Brock keeps the anchors: `CONTROLLER_SILHOUETTE_ANCHORS`, the anchor ids, the variants and the anchor types stay exported from `@drizztdourden08/brock-input/renderer`, with the same positions, and `PadOverlay` and the pad page read them. `ControllerSilhouette`, `ControllerSilhouetteProps`, `CONTROLLER_SILHOUETTE_PATHS` and `CONTROLLER_SILHOUETTE_VIEW_BOX` are no longer exported from the module. Upgrading: import them from `@drizztdourden08/tessera/composites`. The migration `silhouette-from-tessera` rewrites those imports.
  - @drizztdourden08/brock-core@0.97.2
  - @drizztdourden08/brock-lint-config@0.97.2
  - @drizztdourden08/brock-thread@0.97.2

## 0.97.1

### Patch Changes

- 1e9e7a6: The `ControllerSilhouette` component comes from Tessera again, and the module no longer carries a copy of it. Brock keeps the anchors: `CONTROLLER_SILHOUETTE_ANCHORS`, the anchor ids, the variants and the anchor types stay exported from `@drizztdourden08/brock-input/renderer`, with the same positions, and `PadOverlay` and the pad page read them. `ControllerSilhouette`, `ControllerSilhouetteProps`, `CONTROLLER_SILHOUETTE_PATHS` and `CONTROLLER_SILHOUETTE_VIEW_BOX` are no longer exported from the module. Upgrading: import them from `@drizztdourden08/tessera/composites`. The migration `silhouette-from-tessera` rewrites those imports.
- Updated dependencies [5d73454]
  - @drizztdourden08/brock-core@0.97.1
  - @drizztdourden08/brock-thread@0.97.1
  - @drizztdourden08/brock-lint-config@0.97.1

## 0.97.0

### Patch Changes

- 24c0c28: An app keeps its release notes in the `release-notes/` folder beside its `brock.config.ts`, as the scaffold and the app README say. Before, an app in `apps/desktop` of a workspace had `brock release` and `brock release-notes check` read the repo root instead. Now `brock release`, `brock release-notes check` and the generated workflows all read the app folder (`NOTES_DIR` is `apps/desktop/release-notes`). When the app folder has no `release-notes/` and the repo root has one, they read the root and print one line saying so, so a repo that moved its notes to the root keeps working. The generated workflows follow that choice, so run `brock sync` after moving the notes into the app folder. An app of several keeps its own folder only.
- Updated dependencies [24c0c28]
  - @drizztdourden08/brock-thread@0.97.0
  - @drizztdourden08/brock-core@0.97.0
  - @drizztdourden08/brock-lint-config@0.97.0

## 0.96.1

### Patch Changes

- @drizztdourden08/brock-core@0.96.1
- @drizztdourden08/brock-lint-config@0.96.1
- @drizztdourden08/brock-thread@0.96.1

## 0.96.0

### Minor Changes

- 86159bd: The input module now adds a Controllers hub in place of the single input tester screen. The hub has the id `controllers` and sits under Advanced, outside the hub switcher. It holds a Directory page (a searchable table of every controller SDL3 knows, with Rescan), a Logs page (the connect and disconnect history) and a Diagnostics page (the guided capture wizard and its result). The pages come with the stick and trigger calibration wizards, the HID byte capture and the diagnostics report builder. The module exports `ControllerDirectory`, `ControllerLogs` and `ControllerDiagnostics`, plus `StepIndicator`, `ReportSection`, `buildReport`, `useDiagnosticsWizardState` and the other pieces an app needs to build its own report dialog around the wizard. `registerDeviceCardActions` keeps working, and is the hook an app uses to add a Report button. The Controllers hub also has a live page for each connected pad: the pad drawn with a callout for each input, the sticks and triggers with their calibration, the buttons, and the facts of the controller with its rumble tests. Its Controller box shows Run diagnostics and every action added with `registerDeviceCardActions` as icon buttons. `registerRumbleTests` adds rumble test buttons after the module's own, and `registerGlyphSource` supplies the button and pad images, which the module does not ship (with none registered the pad page draws without glyph images). The module also exports `PadOverlay`, `DpadCross`, `SvgImage`, `CONTROLLER_SLOT_IDS` and `ControllerExtra`. The capture API gains `writeDebug(name, data)` (the channel `input:capture:writeDebug`), which writes a JSON file under the data folder's `debug` folder; the diagnostics wizard and the HID calibration use it instead of an app call. The peer range for `@drizztdourden08/tessera` is now `>=0.60.0`. `brock-build` adds `<id>.page.tsx` and `<id>.live.tsx` to the module file names its structure check accepts. Upgrading: `InputTester`, `DeviceCard`, `CalibrationPanel` and its types, `ControllerLayout` with `ControllerLayoutProps`, `ControllerLayoutVariant`, `ControllerSlots` and `CONTROLLER_LAYOUT_VARIANTS` (use Tessera's `ControllerSilhouette` or the new `PadOverlay`), `inputFamilyOf`, `inputTesterScreen` and `INPUT_TESTER_SCREEN_ID` are removed, and the `input-tester` screen is gone, so the Advanced entry now opens the `controllers` hub. An app that declares its own bucket with the id `controllers` fails at start. `brock upgrade` turns each import of a removed name, a `controllers` bucket in `screens.config.ts`, an `input-tester` id and an input module override with `screens: []` into a to-do (migration `controllers-bucket`).

### Patch Changes

- @drizztdourden08/brock-core@0.96.0
- @drizztdourden08/brock-lint-config@0.96.0
- @drizztdourden08/brock-thread@0.96.0

## 0.95.0

### Patch Changes

- @drizztdourden08/brock-core@0.95.0
- @drizztdourden08/brock-lint-config@0.95.0
- @drizztdourden08/brock-thread@0.95.0

## 0.94.0

### Patch Changes

- ce11ef6: Catalog ranges that YAML cannot read plain are now quoted. `brock upgrade` wrote `>=0.58.0 <1` as the Tessera catalog value, and pnpm then failed on the app's `pnpm-workspace.yaml` with a line break error. The upgrade, `mergeCatalog` and the scaffolder now share one helper, `yamlScalar`, that quotes a value only when it needs it (`^1.2.3` stays plain). The catalog readers strip the quotes, so a quoted value round-trips. Upgrading from a Brock checkout now sets the Tessera catalog to the version that checkout is tested on, not to the wider peer range.
- Updated dependencies [ce11ef6]
- Updated dependencies [aeee8c7]
  - @drizztdourden08/brock-thread@0.94.0
  - @drizztdourden08/brock-core@0.94.0
  - @drizztdourden08/brock-lint-config@0.94.0

## 0.93.1

### Patch Changes

- fb7f2e4: Generated `.brock` files are written with LF and compared without regard to line endings, and `.brock/tessera-parts.ts` is put back when `tessera guide` changed only its line endings, so a build no longer churns git.
  - @drizztdourden08/brock-core@0.93.1
  - @drizztdourden08/brock-lint-config@0.93.1
  - @drizztdourden08/brock-thread@0.93.1

## 0.93.0

### Patch Changes

- Updated dependencies [ee7a2a8]
  - @drizztdourden08/brock-core@0.93.0
  - @drizztdourden08/brock-lint-config@0.93.0
  - @drizztdourden08/brock-thread@0.93.0

## 0.92.0

### Minor Changes

- ca050ce: `brock-react` now requires Tessera `^0.58.0`. The release adds Bxel file type icons, a windowed VirtualGrid, DynamicInput character sets and validation, and Toolbar click menus. It has no MIGRATION entry, and Brock needed no code change for it. `brock icons` now reads the file type icons from the plain brand folder when the brand has a rim, because Tessera ships `filetypes/` only there. Before, a light rim brand such as Bxel with `rim: 'light'` got no file type icons.

### Patch Changes

- @drizztdourden08/brock-core@0.92.0
- @drizztdourden08/brock-lint-config@0.92.0
- @drizztdourden08/brock-thread@0.92.0

## 0.91.0

### Patch Changes

- Updated dependencies [c364271]
  - @drizztdourden08/brock-core@0.91.0
  - @drizztdourden08/brock-lint-config@0.91.0
  - @drizztdourden08/brock-thread@0.91.0

## 0.90.0

### Minor Changes

- a45f9fd: File type icons come from the brand, and a settings page can read app values. `brock icons` copies `brand/<brand>/filetypes/<type>/` for each file association into `build/filetypes` (an `.ico`, an `.icns` and the Linux sizes), the builder config points each association that sets no `icon` at it, and `brock sync` ignores the folder. A settings page (`meta.source` of a `.settings.ts` file, or `source` on a tab) or a section can name a `source` of `{ get(key), set(key, value), subscribe?(listener) }`; its rows read and write through it, and the hub search and the palette still find them. Profile settings stay the default.

### Patch Changes

- @drizztdourden08/brock-core@0.90.0
- @drizztdourden08/brock-lint-config@0.90.0
- @drizztdourden08/brock-thread@0.90.0

## 0.89.1

### Patch Changes

- fa073a6: The app commands of the `brock` CLI (`dev`, `build`, `package`, `icons`, `start`, `add`, `platform`, `web`, `server`) work from any folder inside the repo. They use the nearest folder above the current one that holds `brock.config.ts`, else the only app of the workspace, and run from that folder. With several apps they take `--app <dir>`, or stop and list the apps. A build run from the repo root no longer fails to find the app. ensure-electron no longer runs `pnpm install --force` or deletes `node_modules/electron`: it re-runs the package install script, and when the binary is still missing it exits 1 and prints `pnpm install` for the repo root.
  - @drizztdourden08/brock-core@0.89.1
  - @drizztdourden08/brock-lint-config@0.89.1
  - @drizztdourden08/brock-thread@0.89.1

## 0.89.0

### Patch Changes

- b393714: Run `brock knip` from an app folder against the workspace config. A run from `apps/desktop` read only the app folder, so it had no test entries: it flagged test-only exports and unused files that the run from the repo root accepts. When the repo above lists the folder under `workspaces` in its `knip.json`, the command now runs knip from that repo with `--workspace` set to the folder, so the app run and the root run give the same answer. A run that passes its own `--workspace` is left alone.
  - @drizztdourden08/brock-core@0.89.0
  - @drizztdourden08/brock-lint-config@0.89.0
  - @drizztdourden08/brock-thread@0.89.0

## 0.88.1

### Patch Changes

- @drizztdourden08/brock-core@0.88.1
- @drizztdourden08/brock-lint-config@0.88.1
- @drizztdourden08/brock-thread@0.88.1

## 0.88.0

### Patch Changes

- Updated dependencies [8422f5e]
  - @drizztdourden08/brock-core@0.88.0
  - @drizztdourden08/brock-lint-config@0.88.0
  - @drizztdourden08/brock-thread@0.88.0

## 0.87.2

### Patch Changes

- 82d23f3: Give the server and helper bundles a working `__dirname`, `__filename` and `require.resolve` for inlined CommonJS packages. A package such as ssh2 that reads `__dirname` at top level no longer dies at start with `ReferenceError: __dirname is not defined in ES module scope`. The bundle defines them under private names in an output banner and `define` maps the free identifiers to those names, so a bundled module that declares its own `__dirname` is not touched. `__dirname` is the folder of the bundle, `dist/server` or `dist/helpers`. A helper bundle now starts with that banner, so its bytes change.
  - @drizztdourden08/brock-core@0.87.2
  - @drizztdourden08/brock-lint-config@0.87.2
  - @drizztdourden08/brock-thread@0.87.2

## 0.87.1

### Patch Changes

- 25cb813: `BrockServerOptions` types `optionalAddons`, so a brock.config.ts that sets `server.optionalAddons` typechecks. The build already read it in 0.87.0.
- b079114: Fix the duplicate copy of standards in a repo that is ahead of Brock. These packages asked for standards `^0.11`, so a repo on standards `^0.12` got two copies and `standards sync` failed with "Cannot redefine plugin". The range is now `>=0.11.0 <1`, so the one copy a repo installs satisfies every Brock package.
- Updated dependencies [b079114]
  - @drizztdourden08/brock-lint-config@0.87.1
  - @drizztdourden08/brock-thread@0.87.1
  - @drizztdourden08/brock-core@0.87.1

## 0.87.0

### Minor Changes

- 2092aad: Set up the Linux test job of the managed ci.yml. `workflows.testEnv` in `brock.config.ts` takes `linuxPackages`, Debian package names that the `quality` job installs with `apt-get install -y --no-install-recommends` before the build (checked with the pattern `server.osPackages` uses), and `userNamespaces: true`, which adds the step that sets `kernel.apparmor_restrict_unprivileged_userns=0` so a test can run a real bubblewrap sandbox. The step is the one the `review` job runs, now shared. It is a sibling of `workflows.ci` because that key is the `managed` or `own` mode. An app that sets neither option gets the same ci.yml as before. `docs/architecture.md` says that `server.osPackages: ['bubblewrap']` already reaches the `.deb` `Depends` and the Docker image, and lists the `docker run` and compose security options a container running bubblewrap needs.
- 20ce5ee: Docked toolbars by convention, on Tessera `^0.56.0`. An app puts a toolbar in `src/toolbars/<id>.toolbar.tsx`, default-exporting `defineToolbar({ id, label, defaultSide, hiddenByDefault?, render(slot) })`; `slot` carries the orientation, the grip `handle` and the `side`. `brock sync` lists the files in `.brock/toolbars.ts` as `appToolbars`, `brock structure` accepts and checks the folder, and `RendererModule.toolbars` adds a module's toolbars.

  `BrockApp` takes `toolbars` and, when at least one is registered, wraps the widget host in Tessera's `ToolbarDock` inside `brock-app__stage`. An app with no toolbars is unchanged. The layout is saved per profile as its own `toolbarLayout` key in `ui-views.json` beside `widgetLayout`, loaded with `migrateToolbarLayout`, and defaults to `createToolbarLayout`. `useToolbarMenuEntries()` adds a Toolbars sub-menu to Widgets, with its own Reset toolbars entry; Reset layout still resets widgets only.

  The `toolbar-files` migration (0.87.0) adds `toolbars={appToolbars}` and its import to `src/main.tsx`. The lint stack allows the default export in `src/toolbars/*.toolbar.tsx`.

- 928ded0: When `workflows.publish` is set, `brock sync` also writes a managed `publish-packages.yml` that publishes the listed packages on `workflow_dispatch`, with an optional `packages` input for a comma-separated subset. It shares its steps with the `publish-packages` job of `release.yml`, needs no app build job, and refuses a folder that is not in `workflows.publish`. `brock check` compares the new file, and an app without `workflows.publish` gets no file.
- 5c45abf: Add `server.optionalAddons: string[]` to `brock.config.ts`, a list of package names. For a `.node` require, or a `bindings`, `node-gyp-build` or `prebuild-install` load, inside a listed package, `brock server build` replaces the addon with a module that throws when it loads, so the package's own try/catch runs and the bundle carries no binary (ssh2 and cpu-features work this way). An addon in the app's own code or in an unlisted package is still refused, and the error now names the package and points to `server.optionalAddons`. `@drizztdourden08/brock-electron/server` also exports `resolveDataDir(argv, env, cwd)`, the rule `runServer` uses for the data folder (`--user-data=`, `BROCK_DATA_DIR`, `STATE_DIRECTORY`, then `./.user-data`); `runServer` calls the same function.

### Patch Changes

- Updated dependencies [f32d5d9]
- Updated dependencies [20ce5ee]
  - @drizztdourden08/brock-core@0.87.0
  - @drizztdourden08/brock-lint-config@0.87.0
  - @drizztdourden08/brock-thread@0.87.0

## 0.86.0

### Minor Changes

- e04f39c: Scaffold the server kind. `create-brock --platforms server` writes a windowless app from a new `template-server`: no Electron, React or Tessera dependency of its own, no Electron binary built on install, a `brock.workspace.mjs` that launches the built server, and `server/main.ts`, `server/start.ts` and `server/data-domains.ts`, where main calls `runServer` with `createDataDomains`, start logs one line and each file exports one value. `--platforms desktop,server` writes the desktop app with the same two files and an `electron/boot/server.task.ts` boot task that embeds the server through `embedServer`. The files come from a new scaffold step of the server platform, so `brock platform add server` adds them to an existing app too; the step skips a file the app already has and an app that sets `server.entry`, and adds the server entry and folder to `knip.json`. The scaffolder's closing lines no longer ask for a second `platform add` when no chosen platform has a step that needs the install. `brock-build` exports `shapeOf`. `docs/architecture.md` gains a section on the server kind (runtime, build, packaging, workflows, and the security notes on the deb unit and the account checks), and the brock-build, brock-electron and create-brock READMEs point to it.
- 2bc3e29: Any repo with a `brock.workspace.mjs` can get its own command from brock-thread alone. brock-thread gains a `brock-thread` bin with `brock-thread link [--force]`, which installs the launcher `bin/<name>.mjs`, the `bin` entry and the `postinstall` for the workspace `name`, and `brock-thread <verb>` for the thread verbs. The launcher, its template, `installLauncher`, `launcherName` and `launcherSource` moved from brock-build to brock-thread, which brock-build now imports, so `adopt`, `create-brock` and `sync` write the same file as before. A repo that already has a command of that name, such as `tessera`, keeps it: `link` leaves its `package.json` alone and checks that its file forwards the thread verbs with `runThreadCli(argv)`, new in `@drizztdourden08/brock-thread/cli` beside `runThread` and `threadVerbNames`. It returns null for a word that is not a thread word, so the repo's own command handles it.

### Patch Changes

- 49ea4f8: `brock sync` finds the repo owner for `workflows.publish` in a linked git worktree too. It follows the `.git` file to the main repository's config instead of reading only a `.git` folder, so a worktree no longer falls back to the `repository` field of the root package.json.
- Updated dependencies [2bc3e29]
  - @drizztdourden08/brock-thread@0.86.0
  - @drizztdourden08/brock-core@0.86.0
  - @drizztdourden08/brock-lint-config@0.86.0

## 0.85.0

### Minor Changes

- 4cd024c: The managed workflows of a server app. An app with `server` in `targets` gets a `server` CI job (build the bundle, start it on a temporary data folder, wait up to 30 seconds for `health`, stop it), a `build-server` release job on ubuntu-24.04 (`brock server package --arch <server.arch> --deb`, uploading the tarball and the .deb as release files and the Docker context as a build artifact), and a `publish-server-image` job after the release job. The image job is the only one with `packages: write`. It uses docker buildx, adds QEMU only when `server.arch` has `arm64`, logs in to ghcr.io with `GITHUB_TOKEN`, and pushes `server.image` (default `ghcr.io/<repo owner>/<id>-server`) tagged with the version, plus `latest` only when the release runs with `set_latest`. `server.image` must live under `ghcr.io/`. The new Docker actions are pinned to full commit SHAs (setup-qemu-action v4.4.0, setup-buildx-action v4.4.1, login-action v4.6.0, build-push-action v7.4.0). An app whose only target is `server` has no `review` job. `Platform` gains `publishJob`, a job that needs the release job, and app steps can name the new jobs (`server` in CI, `build-server` in the release). A desktop-only app keeps byte-identical workflows.

### Patch Changes

- @drizztdourden08/brock-core@0.85.0
- @drizztdourden08/brock-lint-config@0.85.0
- @drizztdourden08/brock-thread@0.85.0

## 0.84.0

### Minor Changes

- b2562cf: The server app kind packages. `brock server package [--arch x64,arm64] [--deb]` builds the server, then fills `release/server`: `<prefix>server-linux-<arch>.tar.gz` (the launcher `bin/<id>-server`, a pinned Node binary and `server/main.mjs`, under `<id>/`), a `docker/` build context made from the same tarballs, and with `--deb` a `<prefix>server_<version>_<arch>.deb`. The Node binary comes from nodejs.org, is checked against SHASUMS256.txt, and is cached in `~/.brock/cache/node`; a mismatch stops the build. `--deb` needs `dpkg-deb` and refuses with a clear message on a machine without it (`brock doctor` checks it on Linux). The tarball is written by Brock itself, so the modes are right when it is built on Windows. A server-only app runs the same command as `brock package`. New `server` options in brock.config.ts: `node` (exact Node version, default 24.11.0), `osPackages` (Debian names, the deb `Depends` and the Docker `apt-get install`), `ports` (EXPOSE and the unit description), `image` (default `ghcr.io/<repo owner>/<id>-server`) and `arch` (default `['x64']`; `--arch` overrides it). `brock sync` now keeps `build/server/<id>.service` (system user, `StateDirectory`, restart on failure), `build/server/Dockerfile` (Debian trixie-slim, non-root user, one `/data` volume, `HEALTHCHECK` running `<id>-server health`), `build/server/postinst` and `build/server/prerm`; an optional `build/server/after-install.sh` runs in postinst before the service starts.

  The unit is sandboxed (`NoNewPrivileges`, `ProtectSystem=strict`, `ProtectHome`, `PrivateDevices`, `StateDirectoryMode=0750`, `UMask=0027`) and gets `AmbientCapabilities=CAP_NET_BIND_SERVICE` only when `server.ports` lists a port below 1024. A `product.id` that names a system account (root, daemon, www-data, `systemd-*` and the rest of a fixed list) or cannot be an account name is refused by `brock sync`. postinst stops when an account of that name exists and is not the one the package made, joins an existing group of that name, enables and starts the service on a first install only, and `try-restart`s it on an upgrade. The Node archives of the default version are pinned by sha256 in `SERVER_NODE_SHA256` (how to update them is in the brock-build README), the tarball writer refuses absolute and `..` paths, and the deb control fields are checked: the maintainer email and the version must be plain.

### Patch Changes

- fd15732: brock sync now prints one line per package when it moves a dependency range off the brock.version pin, naming the old range, the new range and `brock upgrade`, and brock migrate warns when --report lands outside --root because it is relative to the current directory.
  - @drizztdourden08/brock-core@0.84.0
  - @drizztdourden08/brock-lint-config@0.84.0
  - @drizztdourden08/brock-thread@0.84.0

## 0.83.0

### Minor Changes

- 203ad09: `workflows.attest` takes `perFile: true`, and `BrockWorkflowOptions` now types `attest` and `publish`. With `perFile`, each matched file gets its own attestation, so its `<file>.sigstore.json` has exactly one subject. The action cannot loop and the globs are only known at run time, so sync writes a shell step that expands `paths` and 16 `actions/attest-build-provenance` steps, one per file slot, that skip when empty; the step fails when no file matches or more than 16 do. Without `perFile` nothing changes.
- 495cd91: The server app kind builds. `server` is a new platform in `targets`: `targets: ['server']` is a windowless app, `['desktop', 'server']` ships both. `server.entry` in brock.config.ts names the entry, default `server/main.ts`. `brock server build` bundles it with Vite SSR into `dist/server/main.mjs`, one Node file with every dependency inlined, the app's `build.aliases` and `build.define` applied, and `brock server dev` rebuilds on change and restarts it with `node --watch`; anything after `--` reaches the app. The bundle refuses an `electron` import and a native `.node` addon (and the `bindings` and `node-gyp-build` loaders) with a clear error. The helper bundle now calls the same Node bundle config, and its output is unchanged. `brock build` builds the server for a server app and both builds for a desktop plus server app, and `brock build --if-stale` checks `dist/server/main.mjs` and the `server` folder. A windowless app gets none of the Electron or renderer managed files (electron.vite.config.ts, electron-builder.config.cjs, the boot, handler, review, screen, widget, title bar, tour and start-up lists, the palette and the module lists but the manifest) and none of the installer or screen checks; `brock dev` on it points at `brock server dev`. The managed tsconfig.json now includes `server`, so every app's tsconfig changes on its next `brock sync`. In thread, `serverTarget({ app, userData, states })` is a launch target: dev runs `brock server dev`, `--prod` runs `brock build --if-stale` then `node dist/server/main.mjs --user-data=<dir>`, output piped, and only the state `none` unless a states hook is given.
- 7a23ca9: Title bar items take `disabledReason` beside `disabled`, and a `status` spec takes both. Brock hands them to Tessera 0.53, which makes a disabled action inert and shows the reason as its tooltip. `brock-react` now requires Tessera `^0.53.0`. `disabledReason` is a literal a lazy title bar button can keep.

  `SettingItem.hint` is optional. Tessera 0.53 draws a settings row with no hint line and no gap when the hint is missing or empty, and Brock hands the row `undefined` as it is. The settings search, the palette and the build-time seeds already treat a missing hint as no text. A linked toggle with no hint draws none.

- 203ad09: `workflows.publish: { packages, registry? }` publishes workspace library packages to GitHub Packages from the managed `release.yml`. `packages` are workspace folders, and `registry` takes `'github'`. `brock sync` adds a `publish-packages` job that waits for `prepare` and every build job, runs on `ubuntu-24.04` with `contents: read` and `packages: write`, installs with the frozen lockfile, builds each package that has a `build` script, and runs `pnpm publish --no-git-checks` for each one with `GITHUB_TOKEN`. A version `npm view` already finds is skipped, so a re-run is safe. Sync refuses a path that is not a workspace package, a `private: true` package, a name outside the repo owner's scope, and a package without `publishConfig.registry` set to `https://npm.pkg.github.com`, and says how to fix each. An app repo publishes its libraries without owning the workflow. `brock structure` expects a package listed there to be named `@<owner>/<app>-<subject>`, and every other package keeps `@<app>/<subject>`; the finding names the form that applies.

### Patch Changes

- ef025e4: `brock sync` ignores the generated icon files (`public/logos/icon.svg`, `icon.ico`, `icon-256.png`, `icon-32.png`, `icon-24.png`, the `icon-bot` files, `mark.svg`, `build/icons/` and `build/splash/`) only for an app that sets `icons.brand`, the case where Brock generates them. The lines name that app's own folder and sit in a marked block that sync rewrites and nothing else. An app without `icons.brand` supplies those files itself and no longer needs `git add -f`; one that drops `icons.brand` loses its lines on the next sync. `brock adopt` no longer writes these lines.
- Updated dependencies [203ad09]
- Updated dependencies [10222eb]
- Updated dependencies [495cd91]
- Updated dependencies [203ad09]
  - @drizztdourden08/brock-core@0.83.0
  - @drizztdourden08/brock-thread@0.83.0
  - @drizztdourden08/brock-lint-config@0.83.0

## 0.82.0

### Minor Changes

- 39c91ec: ControllerLayout, StickPlot and PressedGrid move from Tessera to the input module. They keep their props and types, and the module exports them from `@drizztdourden08/brock-input/renderer` with `CONTROLLER_LAYOUT_VARIANTS`, `CONTROLLER_SLOT_IDS`, `ControllerExtra`, `ControllerSlots` and the prop types of each. `CalibrationPanel` and the device card now use the local copies. The controller strings (`Controller`, `Held now`, the slot names) ship with the component, so a Tessera strings override no longer reaches them. The BEM block of each part gains an `input-` prefix (`input-controller-layout`, `input-stick-plot`, `input-pressed-grid`), so an app stylesheet that reached into the old classes needs the new names. The `controller-components-to-input` migration of 0.82.0 rewrites an app's imports of the three names, and of their types, from `@drizztdourden08/tessera` and its `/composites` entry to `@drizztdourden08/brock-input/renderer`; the app needs the input module installed. The import codemod now also sees files that import only from the Tessera root.
- b5c6c13: A release step can declare `permissions`, and `workflows.attest` attests release files. A step under `workflows.steps.release.*` takes `permissions` (GitHub permission names with `read`, `write` or `none`) and an `id`; `brock sync` lifts the permissions onto each job that runs the step, merged with the workflow's own, where write wins, and fails on a name or level it does not know. `workflows.attest: { paths, stage }` (`beforePackage` or `afterPackage`) adds `actions/attest-build-provenance`, pinned to a full commit SHA, to the `build-linux` job of the managed `release.yml`, writes each Sigstore bundle beside its file as `<file>.sigstore.json`, and lifts `id-token: write` and `attestations: write` onto that job. An app attests its release files without owning the workflow.

### Patch Changes

- 1a68403: Brock 0.81.0 filed the migration documents-access-async under 0.80.0, so an app that upgraded from 0.80.x to 0.81.0 never ran it; it is now filed under 0.81.0. An app already on 0.81.0 runs it with `brock migrate --run documents-access-async`, a new option that runs one migration by id at any version. A keep test now fails when a migration folder is older than the release whose changelog first names it.
- Updated dependencies [9e2ade8]
- Updated dependencies [b5c6c13]
  - @drizztdourden08/brock-lint-config@0.82.0
  - @drizztdourden08/brock-core@0.82.0
  - @drizztdourden08/brock-thread@0.82.0

## 0.81.0

### Patch Changes

- Updated dependencies [1f6543a]
  - @drizztdourden08/brock-core@0.81.0
  - @drizztdourden08/brock-lint-config@0.81.0
  - @drizztdourden08/brock-thread@0.81.0

## 0.80.0

### Minor Changes

- b6459f5: Breaking: `ctx.window` is now a function with a `show()` method and `AutomationFlags` gains `isBackgroundLaunch()`, so a hand-built `MainContext` or flags object in a test needs the new members; migration main-context-window-show leaves a to-do at each one.

  feat: background launch and an opt-in tray icon

  An app can start with no window. A `--background` launch, or a `beforeWindow(ctx)` hook that returns `'skip'`, skips the splash and the app window while the whole boot and the bridge still run. `ctx.window.show()` creates the window on demand, or restores and focuses it. In background mode the app keeps running when the last window closes. A normal second launch shows the window, a second launch with `--background` shows nothing, and automation launches behave as before.

  `product.tray` or `ctx.tray.set({ tooltip, icon?, menu? })` adds a tray icon. It uses the app icon by default, a left click shows the window, the menu takes show and quit actions, id items for `ctx.tray.onItem` and separators, and the tray is removed on quit. It is off unless the app asks.

- 845f695: Breaking: hub pages draw no big page header by default, and the app can take over the content side of a hub. A page shows the header only with `showHeader: true` in its meta (a page that declares `header: { primary, search }` keeps it, a page with tabs keeps its tab bar, a sub page keeps its back button); a page that fills the header with `PageActions` needs `showHeader: true`. Migration `hub-page-header-off` (0.80.0) lists each hub page and custom page without a header setting as a to-do. New: `bare: true` in the meta of a `.page.tsx`, `.custom.tsx`, `<page>.page.ts` or `.live.tsx`, or on a `LivePage` entry, renders the page straight into the content slot with no card, padding, header or scroll area, named by the page title for assistive tech. `pages: 'bare'` on a bucket (or `HubDef`) makes every page of the hub bare, and a page opts back in with `bare: false`. `WindowItem` takes `bare: true` to drop the pane scroll area of one `defineWindow` item. `HubPagesMode` is exported.
- 9398c37: Breaking: the helper bridge moves to protocol 2, so a helper built against 0.78 or 0.79 cannot talk to an app on this version and must be rebuilt (`brock build` bundles it again) and shipped with the app; `bridge.emitTo` now returns a count. Migration `bridge-protocol-2` turns each `connectBridge` use and each `.emitTo(` into a to-do, since the fix is a rebuild and a release, not a code edit.

  Bridge v2. `ctx.bridge.open()` and `ctx.bridge.close()` open and close the bridge at run time, each open with a new secret and endpoint, and serialized so a close and a reopen never remove the live discovery file; `bridge.openOnBoot: false` keeps it closed until the app opens it. `bridge.handleWith(route, (call, ...args) => ...)` gives handlers `call.connectionId` (16 random bytes, not a capability), and `bridge.onOpen`, `bridge.onClose` and `bridge.connections()` follow clients; a throwing listener is logged. `bridge.emit(event, ...args)` and `bridge.emitTo(connectionId, event, ...args)` push events, which the helper hears with `client.on(event, listener)` after `client.connect()`. The client authenticates with the session key before any request, and every server message is signed with it, pushes with their own counter. Each connection holds at most `maxBufferedBytes` (4 MiB) of unread output: pushes past it are dropped and a reply that does not fit closes the connection. `BridgeError` takes `{ code, data }`, which reach the client as fields; other errors stay masked, and Brock's codes are in `BRIDGE_CODES`. The client reads the discovery file through one handle with no link followed, checks that handle and, on macOS and Linux, the folder. `helperLaunch(name)` sets `BROCK_BRIDGE_FILE` to this app's discovery file.

- f103e8b: Packaged apps now flip Electron fuses in the managed electron-builder config. `EnableNodeOptionsEnvironmentVariable` and `EnableNodeCliInspectArguments` are off, so `NODE_OPTIONS` and `--inspect` no longer work on a packaged app. `OnlyLoadAppFromAsar` and `EnableCookieEncryption` are on, and `EnableEmbeddedAsarIntegrityValidation` is on for Windows and macOS builds (Electron has no asar integrity on Linux, so it stays off there). `RunAsNode` follows `helpers`: on when `brock.config.ts` declares helpers, since they start through `ELECTRON_RUN_AS_NODE`, and off otherwise. The new `fuses: { runAsNode }` option overrides it; `false` beside declared helpers is refused. `brock dev` and the headless launches use the dev Electron and are unchanged. The cookie fuse is a one-way change for existing cookie stores. The managed `files` list also leaves out hidden folders inside `node_modules`: a linked package is packed whole, and files that change while the asar is written make its integrity data wrong, which the integrity fuse turns into a start-up failure.
- 7fe7469: Start-up prompts and a richer confirm dialog. A start-up prompt is `src/startup/<id>.prompt.ts`, default-exporting `defineStartupPrompt({ order?, run(ctx) })`; `RendererModule.startupPrompts` adds a module's. Brock runs them once per launch, one at a time in `order`, after the window reveal, once a profile is active with its settings loaded and after any first-run tour has ended or been skipped, and never on an automation launch. A prompt that throws is logged and the next one runs. `ctx` carries `confirmAction`, `confirmChoice`, `confirmSave`, `profile`, `settings` (`get`, `patch`, `flush`) and `nav`. `brock sync` writes `.brock/startup.ts` (a prompt with a literal `order` loads when it runs), `src/main.tsx` passes it as `startupPrompts` (the `startup-prompts` migration of 0.80.0 adds that), `brock structure` checks the folder and the lint preset lets prompt files default-export. `confirmChoice` takes `look: 'select'` (Tessera's `Select`, with `searchable`) in place of the radio group and still resolves the picked value, or `null` on cancel. Every confirm dialog takes `facts: { label, value }[]`, drawn under the message with Tessera's `FactsPanel`. Defaults are unchanged.

### Patch Changes

- Updated dependencies [b6459f5]
- Updated dependencies [7fe7469]
  - @drizztdourden08/brock-core@0.80.0
  - @drizztdourden08/brock-lint-config@0.80.0
  - @drizztdourden08/brock-thread@0.80.0

## 0.79.0

### Patch Changes

- Updated dependencies [6b26c03]
  - @drizztdourden08/brock-core@0.79.0
  - @drizztdourden08/brock-lint-config@0.79.0
  - @drizztdourden08/brock-thread@0.79.0

## 0.78.0

### Minor Changes

- 0a78a00: Outside helpers and the bridge. `helpers` in `brock.config.ts` names standalone Node entries, such as a stdio MCP helper: `brock build` and `brock dev` bundle each into `dist/helpers/<name>.mjs` with only Node built-ins left as imports, refuse an Electron import, and the managed electron-builder config ships them in `resources/helpers` outside the asar. `bootstrapApp({ bridge: { register } })` opens an opt-in local bridge in main: a per-session named pipe on Windows or a 0600 Unix socket in a private temp folder, never TCP, guarded by a random per-session secret that never crosses the wire: an HMAC handshake proves both ends hold it, and each request carries an HMAC under a session key, with ids that must grow. The discovery file always lives in the per-user app data folder, keyed by instance or data folder, private to the user (0600, or on Windows an owner and a single access entry for the user, set and checked with System32's icacls), cleared when stale and removed on quit. The client refuses a stale or open file, a dead pid, a non-local endpoint and, on POSIX, a socket folder that is not the user's own. Unauthenticated connections have their own cap and a 2 s deadline, and the client gives up on a handshake after 2 s. Routes take a `validate` check, and handler errors are masked unless they are a `BridgeError`. Routes are `invoke` entries, as in the IPC contract. Messages are JSON lines with ids, bounded by `maxMessageBytes`. The helper's client is `connectBridge` from the new `@drizztdourden08/brock-electron/bridge` entry, which imports nothing from Electron. `helperLaunch(name)` gives the command, arguments and environment for an MCP client config.

### Patch Changes

- @drizztdourden08/brock-core@0.78.0
- @drizztdourden08/brock-lint-config@0.78.0
- @drizztdourden08/brock-thread@0.78.0

## 0.77.0

### Minor Changes

- 44c38e9: Live hub pages. A `<id>.live.tsx` file in a bucket or group folder is a slot in the hub nav that fills at runtime. It default-exports a hook that returns `LivePage[]` (`key`, `title`, `icon`, `badge` of `'ok'` or `'warn'`, `render`) and exports `meta: LiveMeta` (`icon`, `empty`, `title`, `order`, `keywords`, `devOnly`). The slot sorts by `meta.order` among the static pages, so Directory, one entry per connected pad, then Logs and Diagnostics keep their order. The badge shows as a status dot on Tessera's `SideNavItem`, `empty` shows as a disabled nav entry while the list is empty, and `keywords` feed the hub search. An entry opens at `<bucket>/<id>/<key>` (`section` and `tab`); when it disappears, the hub shows the first static page of the group. `brock sync` reads the file as an eager kind, and `brock-lint-config` treats it as a screen file. See Live hub pages in `docs/app-structure.md`.

### Patch Changes

- 9b5dd81: The knip config that `brock adopt` writes, and the app template, now list `src/views/*/*.usage.ts` as entries. Tessera usage files are read by tooling and never imported, so knip no longer reports them as unused. A lazy title bar button also keeps a literal `disabled` from its spec.
- Updated dependencies [44c38e9]
- Updated dependencies [af040f2]
  - @drizztdourden08/brock-lint-config@0.77.0
  - @drizztdourden08/brock-core@0.77.0
  - @drizztdourden08/brock-thread@0.77.0

## 0.76.0

### Minor Changes

- 1e8234c: Breaking: `matchesShortcut`, `parseShortcut` and `ParsedShortcut` are removed from brock-react, and `Mod` now means only the platform key. Apps move to `commands.matches`, `commands.chords` and `formatChord`; migration `shortcut-helpers-removed` turns each use into a to-do.

  A command keymap. Every shortcut is now a command in one registry: `{ id, label, icon?, group?, chord?, scope?, whileTyping?, when?, run }`. A chord is `'Mod+S'`, a list, or `{ mac, other }`, and `Mod` is Ctrl on Windows and Linux and Cmd on macOS. An app declares commands with `<BrockApp commands>`, `RendererModule.commands`, `useCommands(defs)` in a screen (with `scope` set to the screen id) or `commands.register(defs)`, and runs one with `commands.run(id)`.

  One dispatcher resolves chords. A plain key does nothing while the user types in a field, a Mod chord still fires, and `whileTyping` changes that. A scoped command wins over a global one while its screen is open.

  Users remap chords on the new `KeymapPage`, which an app adds as a settings page file. Remaps are stored per profile in the settings under `keymap` (`BaseSettings.keymap`, `KeymapOverrides` in brock-core). The page shows conflicts and resets one row, a group or all. `commands.remap`, `commands.reset` and `commands.conflicts` do the same from code.

  Menus, title bar tooltips and the Ctrl+/ dialog read the current chord from the registry, so a remap shows everywhere at once. A menu entry takes `command`, and a title bar button spec takes `command` in place of `onSelect`; `brock-build` keeps `command` in a lazy title bar button.

  Brock's own shortcuts moved onto the registry with the same defaults: Search (Mod+K), Keyboard shortcuts (Mod+/), Toggle fullscreen (Alt+Enter) and Go back (Alt+Left, now listed in the dialog). Screen and page shortcuts are `open:<route>` commands. `Mod` now means only the platform key, so Win+K no longer opens Search on Windows. `matchesShortcut`, `parseShortcut` and `ParsedShortcut` are removed; use `commands.matches(id, event)` and `formatChord`.

### Patch Changes

- 3f10ec7: An upgrade worktree no longer fails lint on the files a config generator puts there. `brock prose` skips an untracked `.ai-config.json` and `.mcp.json` at the repo root, and `brockMarkdownlint` skips a `CLAUDE.md`, `AGENTS.md` or `.github/copilot-instructions.md` whose first lines say `GENERATED by ai-config`. A guide an app wrote itself has no such line and stays linted. The list lives in one place, `GENERATED_FILES` in lint-config, with a new `generated-files` export. In a monorepo, `brock sync` now also writes `.markdownlint-cli2.mjs` into an app whose `package.json` has a `lint:md` script, so `pnpm lint:md` in `apps/desktop` finds its config instead of printing help and exiting 2. The root still owns the eslint and stylelint configs, and a single app is unchanged. `create-brock` keeps that file when it scaffolds a workspace app.
- 92b5e9e: A Brock app scaffolded inside a workspace no longer keeps the template's brock.workspace.mjs. Only the workspace root owns one. The app also drops the brock-thread and stylelint-config-standard dev dependencies and the root-only knip entries, which nothing in the app uses. The Tessera range that create-brock puts in the workspace catalog now comes from the range brock-react peers on, so it follows each release instead of a copy that goes stale. `brock adopt` now writes a root workspace in knip.json, with the lint configs and brock.workspace.mjs as entries and the lint binaries ignored. A fresh workspace passes `brock knip` without a hand-written entry.
- Updated dependencies [1e8234c]
- Updated dependencies [05f559e]
- Updated dependencies [5830a25]
- Updated dependencies [3a1ebfb]
- Updated dependencies [3f10ec7]
  - @drizztdourden08/brock-core@0.76.0
  - @drizztdourden08/brock-lint-config@0.76.0
  - @drizztdourden08/brock-thread@0.76.0

## 0.75.0

### Minor Changes

- f7c46f5: Breaking: require Tessera 0.52.0, which drops light backgrounds. `product.icons.rim` takes `'light'` only, and `brock icons` no longer reads `brand/dark-rim`. The hero brand art and the About screen follow the new Tessera types. Apps remove `rim: 'dark'` and any `ground` prop on `BrandMark` or `Logo`; migration `light-ground-removed` lists each one as a to-do.

### Patch Changes

- Updated dependencies [f7c46f5]
  - @drizztdourden08/brock-core@0.75.0
  - @drizztdourden08/brock-lint-config@0.75.0
  - @drizztdourden08/brock-thread@0.75.0

## 0.74.1

### Patch Changes

- @drizztdourden08/brock-core@0.74.1
- @drizztdourden08/brock-lint-config@0.74.1
- @drizztdourden08/brock-thread@0.74.1

## 0.74.0

### Patch Changes

- @drizztdourden08/brock-core@0.74.0
- @drizztdourden08/brock-lint-config@0.74.0
- @drizztdourden08/brock-thread@0.74.0

## 0.73.0

### Patch Changes

- @drizztdourden08/brock-core@0.73.0
- @drizztdourden08/brock-lint-config@0.73.0
- @drizztdourden08/brock-thread@0.73.0

## 0.72.0

### Patch Changes

- @drizztdourden08/brock-core@0.72.0
- @drizztdourden08/brock-lint-config@0.72.0
- @drizztdourden08/brock-thread@0.72.0

## 0.71.1

### Patch Changes

- @drizztdourden08/brock-core@0.71.1
- @drizztdourden08/brock-lint-config@0.71.1
- @drizztdourden08/brock-thread@0.71.1

## 0.71.0

### Patch Changes

- @drizztdourden08/brock-core@0.71.0
- @drizztdourden08/brock-lint-config@0.71.0
- @drizztdourden08/brock-thread@0.71.0

## 0.70.0

### Patch Changes

- @drizztdourden08/brock-core@0.70.0
- @drizztdourden08/brock-lint-config@0.70.0
- @drizztdourden08/brock-thread@0.70.0

## 0.69.0

### Patch Changes

- @drizztdourden08/brock-core@0.69.0
- @drizztdourden08/brock-lint-config@0.69.0
- @drizztdourden08/brock-thread@0.69.0

## 0.68.6

### Patch Changes

- @drizztdourden08/brock-core@0.68.6
- @drizztdourden08/brock-lint-config@0.68.6
- @drizztdourden08/brock-thread@0.68.6

## 0.68.5

### Patch Changes

- @drizztdourden08/brock-core@0.68.5
- @drizztdourden08/brock-lint-config@0.68.5
- @drizztdourden08/brock-thread@0.68.5

## 0.68.4

### Patch Changes

- @drizztdourden08/brock-core@0.68.4
- @drizztdourden08/brock-lint-config@0.68.4
- @drizztdourden08/brock-thread@0.68.4

## 0.68.3

### Patch Changes

- @drizztdourden08/brock-core@0.68.3
- @drizztdourden08/brock-lint-config@0.68.3
- @drizztdourden08/brock-thread@0.68.3

## 0.68.2

### Patch Changes

- @drizztdourden08/brock-core@0.68.2
- @drizztdourden08/brock-lint-config@0.68.2
- @drizztdourden08/brock-thread@0.68.2

## 0.68.1

### Patch Changes

- @drizztdourden08/brock-core@0.68.1
- @drizztdourden08/brock-lint-config@0.68.1
- @drizztdourden08/brock-thread@0.68.1

## 0.68.0

### Patch Changes

- Updated dependencies [1f7604e]
  - @drizztdourden08/brock-core@0.68.0
  - @drizztdourden08/brock-lint-config@0.68.0
  - @drizztdourden08/brock-thread@0.68.0

## 0.67.0

### Patch Changes

- @drizztdourden08/brock-core@0.67.0
- @drizztdourden08/brock-lint-config@0.67.0
- @drizztdourden08/brock-thread@0.67.0

## 0.66.0

### Patch Changes

- @drizztdourden08/brock-core@0.66.0
- @drizztdourden08/brock-lint-config@0.66.0
- @drizztdourden08/brock-thread@0.66.0

## 0.65.0

### Patch Changes

- @drizztdourden08/brock-core@0.65.0
- @drizztdourden08/brock-lint-config@0.65.0
- @drizztdourden08/brock-thread@0.65.0

## 0.64.0

### Patch Changes

- @drizztdourden08/brock-core@0.64.0
- @drizztdourden08/brock-lint-config@0.64.0
- @drizztdourden08/brock-thread@0.64.0

## 0.63.0

### Patch Changes

- @drizztdourden08/brock-core@0.63.0
- @drizztdourden08/brock-lint-config@0.63.0
- @drizztdourden08/brock-thread@0.63.0

## 0.62.0

### Minor Changes

- 9a154a7: Breaking: the navigation store no longer has `escapeTo` and `setEscapeTo`, since Escape now closes the open window and reopens the last one. The `escape-to-removed` migration (0.62.0) leaves a to-do at each use; drop the call, or use `nav.reopen()`.

### Patch Changes

- @drizztdourden08/brock-core@0.62.0
- @drizztdourden08/brock-lint-config@0.62.0
- @drizztdourden08/brock-thread@0.62.0

## 0.61.0

### Patch Changes

- @drizztdourden08/brock-core@0.61.0
- @drizztdourden08/brock-lint-config@0.61.0
- @drizztdourden08/brock-thread@0.61.0

## 0.60.1

### Patch Changes

- @drizztdourden08/brock-core@0.60.1
- @drizztdourden08/brock-lint-config@0.60.1
- @drizztdourden08/brock-thread@0.60.1

## 0.60.0

### Minor Changes

- ebaabc3: Brock moves to Tessera ^0.42.0. A pixel art wordmark (`product.icons.wordmark.rendering: 'pixelated'`) now goes through Tessera on both splashes: the window's failure splash passes `wordmarkPixelated` to `Splash`, and the splash page writes Tessera's `ts-wordmark--pixelated`, so the sprite scales up with hard edges to fill the 384 px row. Brock's own `BootFailureSplash.css` and `.splash__pixelated` rule are gone. A wordmark now draws only as high as its picture, up to 48 px, so a very wide one has no empty band and a smooth one under 48 px high draws at its own height; `brock check` and `brock sync` warn when `src` or `dark` is shorter than 48 px, unless it is pixelated. Docked panes saved without `makeRoom`, in a widget layout or a kit view, now make room on load, and only a pane saved with `makeRoom: false` overlays the main view. Apps upgrade with `brock migrate`.

### Patch Changes

- @drizztdourden08/brock-core@0.60.0
- @drizztdourden08/brock-lint-config@0.60.0
- @drizztdourden08/brock-thread@0.60.0

## 0.59.0

### Minor Changes

- 19b7a49: Breaking: a `volume` title bar item no longer takes `labels`, and brock-react no longer exports `TitleBarVolumeStrings`. Tessera's volume bar item draws the Mute and Unmute labels from its own strings, so an app that passed `labels` removes it. The `volume-item-labels` migration (0.59.0) leaves a to-do where `labels` sits in a file with a volume item, and on each use of `TitleBarVolumeStrings`.
- e886c2a: A Developer submenu in Widgets, and menu placement for widgets and kits. Every `devOnly` widget and every `devOnly` kit now sits in Widgets > Developer (key `widgets-developer`), so a developer kit reads Widgets > Developer > its label > Open kit, its widgets, its overlays and Reset kit layout. Developer shows only while developer tools are on, and it is left out when nothing goes in it. `WidgetMeta` and `WidgetKitMeta` take `menu: { parent, group, order }` (the `WidgetMenuPlacement` type), placed like the same fields of `product.menu.entries`. When a widget, a kit or Developer names a `parent` that no entry has, in its meta or in `product.menu.entries`, that submenu is made inside Widgets, labelled from its key (`audio-tools` reads Audio tools), and the menu config renames or moves it by that key; `parent: 'widgets-developer'` files any widget or kit under Developer, and `parent: null` in the config keeps a `devOnly` one out. `brock structure` accepts `menu` in widget and kit files and reports a placement with an unknown field or a wrong value. The review registers a `devOnly` widget and kit and checks that Developer lists them with the kit as its own submenu, and, in a packaged review, that Developer is gone while developer tools are off; each `devOnly` app kit gets an `app-kit-<id>-in-developer` check.
- ea30589: `product.icons.wordmark` takes `rendering`: `'auto'` (the default, smooth scaling) or `'pixelated'`, for pixel art that should scale with hard pixel edges. With `{ src: './logos/wordmark.png', rendering: 'pixelated' }`, About, the boot splash page, the window's failure splash and the Setup splash draw the wordmark with `image-rendering: pixelated` (nearest neighbour on the Setup splash); without it nothing changes, since most logos look wrong pixelated. `defineProduct` keeps `rendering: 'pixelated'` on the resolved wordmark and refuses any other value. `AboutPanel` takes `wordmarkRendering`.

### Patch Changes

- Updated dependencies [ea30589]
  - @drizztdourden08/brock-core@0.59.0
  - @drizztdourden08/brock-lint-config@0.59.0
  - @drizztdourden08/brock-thread@0.59.0

## 0.58.0

### Patch Changes

- @drizztdourden08/brock-core@0.58.0
- @drizztdourden08/brock-lint-config@0.58.0
- @drizztdourden08/brock-thread@0.58.0

## 0.57.0

### Minor Changes

- 2bf0884: Breaking: brock-core no longer exports its own `formatDate`, `formatRelativeTime` and `DatePreset`. Brock shows dates with Tessera's `DateText` and `formatDate` since 0.56.0. The `core-date-helpers` migration (0.57.0) turns each use in a file that imports brock-core into a to-do pointing to Tessera's `formatDate` in `@drizztdourden08/tessera/primitives` and `DateText` in `@drizztdourden08/tessera/composites`.

### Patch Changes

- Updated dependencies [2bf0884]
  - @drizztdourden08/brock-core@0.57.0
  - @drizztdourden08/brock-lint-config@0.57.0
  - @drizztdourden08/brock-thread@0.57.0

## 0.56.0

### Patch Changes

- @drizztdourden08/brock-core@0.56.0
- @drizztdourden08/brock-lint-config@0.56.0
- @drizztdourden08/brock-thread@0.56.0

## 0.55.0

### Minor Changes

- d974d98: Widget kits are exclusive, and kit widgets can pop out. Brock moves to Tessera 0.38.0.

  One kit is open at a time: opening a kit closes the open one first, with its popped windows. While a kit is open, the normal widget entries and Reset layout in the menu stay enabled. Opening a normal widget, from the menu, a shortcut, `widgets.open`, `widgets.toggle` or `widgets.popOut`, closes the kit first and brings the normal layout back with that widget open. Reset layout closes the kit too. The normal widgets still step aside while a kit is open.

  The widgets API now reaches kit widgets. `widgets.open(id)` on a kit widget, and the new `widgetKits.openWidget(id)`, open its kit, closing any other, and show the widget even if the user had closed it in the kit layout. A widget already shown stays as it is, so a list of ids opened one by one, such as an app's startup flag, opens them all. `widgets.toggle`, `widgets.close`, `widgets.popOut` and `widgets.isVisible` work on kit widgets the same way. Before, `widgets.open` on a kit widget did nothing.

  A kit widget with `popOut` pops out into its own window like a normal widget, and the window belongs to the kit layout. Closing the kit by any route closes its windows, and reopening the kit brings them back popped or docked as they were left. Saved kit layouts now keep their popped widgets, per profile. Each kit widget gets its kit id as its Tessera `group`, so it never tabs or splits with a widget of another group, and a popped kit widget dragged back over the app is offered only to its kit.

  From Tessera 0.38.0: a widget's `chrome` (`full`, `compact` or `none`) is a widget meta field (`meta.chrome`, checked by `brock structure`). It applies docked, floating and popped. Floating widgets snap to the stage edges, the main view and each other (`floatSnap`, 10 px). The template's Layout inspector widgets use `chrome: 'compact'`.

  The review's `kits` step covers one kit at a time, a normal widget closing the kit from the menu and the API, `widgets.open` opening a kit widget's kit, the compact chrome, and a kit widget popping out, closing with the kit and coming back when it reopens.

  The review's bug report step moves the pointer off the title bar button after its click: with Tessera 0.38 a press shows the button's hint, which takes the first Escape.

### Patch Changes

- @drizztdourden08/brock-core@0.55.0
- @drizztdourden08/brock-lint-config@0.55.0
- @drizztdourden08/brock-thread@0.55.0

## 0.54.0

### Minor Changes

- 8a06415: Widget kits: a group of widgets that opens and closes as one unit, keeps a layout of its own and never mixes with the normal widgets. `src/widgets/<id>.kit.ts` default-exports its `WidgetKitMeta` (`label`, `icon`, `order`, `devOnly`, `requires: { context, reason }`, `layout`), a widget joins it with `kit: '<id>'` in its `meta`, and `src/widgets/<id>.overlay.tsx` draws a layer over the main view while the kit is open. `brock sync` writes `.brock/widget-kits.ts` (`appWidgetKits`) for every app, and `BrockApp` takes it as `widgetKits`. `defineWidgetKit`, `registerWidgetKits`, `RendererModule.widgetKits`, the `widgetKits` calls (`open`, `close`, `toggle`, `reset`, `active`, `isOpen`) and `useWidgetKitStore` cover kits made in code.

  Each kit is a sub-menu of Widgets with Open kit or Close kit, its widgets and overlays, and Reset kit layout. While a kit is open, the dock holds only the kit's widgets around the main view, with the same docking, tabbing, floating, snapping and resizing as any widget. The normal widgets and their popped windows step aside and come back when the kit closes. One close in the menu, a bar at the top of the main view and `widgetKits.close()` each close the whole kit, and each widget's own close button still closes that widget alone. A kit whose `requires` context is inactive opens on a card with its reason in place of its widgets, and draws them as soon as the context turns active. Each kit's layout and hidden overlays are saved per profile in `ui-views.json` under `widgetKits`.

  A widget can now put its own buttons in its title strip: `tools` in `meta` (a component) or `defineWidget` (`() => ReactNode`), docked, floating or popped.

  The review has a `kits` step. It checks the gate reason, that a kit opens and closes together, that kits and normal widgets never mix, that each kit's layout is saved and restored, and that overlays live and die with their kit. It also captures every app kit as `kit-<id>`. `brock structure` checks kit and overlay files and every `meta.kit`, and lint lets them default-export. The `widget-kits-prop` migration (0.54.0) adds `widgetKits={appWidgetKits}` to `src/main.tsx`. The template ships a small `inspect` kit: a Grid widget with a reset tool in its title strip, a Pointer widget and a grid overlay.

### Patch Changes

- Updated dependencies [8a06415]
  - @drizztdourden08/brock-lint-config@0.54.0
  - @drizztdourden08/brock-core@0.54.0
  - @drizztdourden08/brock-thread@0.54.0

## 0.53.0

### Patch Changes

- Updated dependencies [60cb320]
  - @drizztdourden08/brock-core@0.53.0
  - @drizztdourden08/brock-lint-config@0.53.0
  - @drizztdourden08/brock-thread@0.53.0

## 0.52.1

### Patch Changes

- @drizztdourden08/brock-core@0.52.1
- @drizztdourden08/brock-lint-config@0.52.1
- @drizztdourden08/brock-thread@0.52.1

## 0.52.0

### Minor Changes

- 1477d7f: Moves to Tessera ^0.37.4. With View hidden, the `window-pin` and `window-fullscreen` menu keys work again: they reach the tucked Pin on top and Full screen rows of the main menu through the title bar's `tucked` prop. `label` renames the row in both states, and the new `activeLabel` field, taken by these two keys only, is its text while the window is pinned or in full screen. `group`, `order`, `before` and `after` place the row as they place View, and `hidden: true` or `inMenu: false` leaves it out. `brock check` warns again when View, Pin on top and Full screen are all out of the menu, since a narrow window then has no way to reach them, warns when either key is set while View is shown, since it then has no effect, and reports an `activeLabel` on any other key.

### Patch Changes

- Updated dependencies [1477d7f]
  - @drizztdourden08/brock-core@0.52.0
  - @drizztdourden08/brock-lint-config@0.52.0
  - @drizztdourden08/brock-thread@0.52.0

## 0.51.1

### Patch Changes

- 024e1b8: Moves to Tessera ^0.37.3. With View hidden, the title bar now lists a tucked pin and full screen button in its own main menu, so Brock drops its own `window-pin` and `window-fullscreen` entries and stops reading the bar's markup for tucked buttons. Pin and full screen are plain actions with no check mark. The `window-pin` and `window-fullscreen` menu keys are still accepted without an unknown key warning, but Tessera takes no label or place for these rows, so the keys no longer rename, move or hide anything. `brock check` no longer warns when View, Pin on top and Full screen are all out of the menu, since the tucked buttons now always stay in the menu.
  - @drizztdourden08/brock-core@0.51.1
  - @drizztdourden08/brock-lint-config@0.51.1
  - @drizztdourden08/brock-thread@0.51.1

## 0.51.0

### Patch Changes

- @drizztdourden08/brock-core@0.51.0
- @drizztdourden08/brock-lint-config@0.51.0
- @drizztdourden08/brock-thread@0.51.0

## 0.50.0

### Minor Changes

- 7230540: The View sub-menu now takes the whole menu config, not just a label. In `product.menu.entries.view`, `hidden: true` or `inMenu: false` leaves View out of the menu, and `group`, `order`, `before` and `after` place it like any other entry. Other entries can also be placed before or after `view`. Brock works out View's group and index from the effective menu and passes them to Tessera 0.37.2's `WindowTitleBar` `view` option. Left untouched or only renamed, View stays where it was. View still can't take a `parent`.

  On a narrow window, the title bar tucks its pin and full screen buttons away into View. With View hidden, Brock adds Pin on top (`window-pin`) and Full screen (`window-fullscreen`) to the menu in View's place while a button is tucked away. They can be renamed, moved or hidden like any entry. The bar button and the menu entry share one pin state.

  `brock check` no longer rejects a placed or hidden View. It still reports a `parent` on `view`. It warns, without failing, when `view`, `window-pin` and `window-fullscreen` are all out of the menu. The review no longer expects a View sub-menu when the config hides it, and checks a moved View between its neighbours. brock-react's Tessera peer range is `^0.37.2`.

### Patch Changes

- @drizztdourden08/brock-core@0.50.0
- @drizztdourden08/brock-lint-config@0.50.0
- @drizztdourden08/brock-thread@0.50.0

## 0.49.0

### Minor Changes

- a0eedd2: A bucket's header backdrop can be a component: `src/screens/<bucket>/<bucket>.backdrop.tsx` default-exports it, and `brock sync` lists it in `.brock/screens.ts` as a `backdrop` entry loaded with `lazyComponent`. `buildScreenTree` makes it the bucket's `{ kind: 'node' }` backdrop inside a `Suspense` with no fallback, and its load joins the preload of the hub home and of every page, tab and sub-page of the bucket, so a bucket switch pill, a menu row or a hub nav entry on hover or focus and the boot preload load it before the header draws. It wins over `backdrop` in `screens.config.ts`, and a page's `meta.backdrop` still wins over both. `brock structure` reports a backdrop file not named after its bucket or outside its bucket folder, a bucket folder holding only a backdrop, and a bucket that has both the file and the config field; the file takes a `<bucket>.backdrop.constants.ts`. The lint config treats it as a screen file (a default export). brock-react exports the `BackdropEntry` type.
- 9ff1b40: The app can now change the title bar menu Brock builds, entry by entry, while the detected menu stays the default. `product.menu.entries` in `brock.config.ts` and the same object in a screen's `meta.menu` take, per entry key, `inMenu: false` (out of the menu only, still reached by the search palette, its route and its shortcut), `hidden: true` (out of the menu, the search palette and the keyboard shortcuts, still openable from code by its route), `label`, `group` (`'main'`, `'sections'`, `'modules'` or `'end'`), `order` (like CSS `order`, 0 by default), `before` and `after` another entry's key, and `parent` (a submenu's key, or `null` for the top level). They merge in that order, the app config last. Every built-in entry, section, bucket, page, card and module entry has a stable key; docs/app-structure.md lists them. The View sub-menu takes only a label, since the title bar draws it.

  `brock check` reports a field it does not know, a wrong value, a `bucket:` or `screen:` key no screen file gives, an entry that names itself and a `before` and `after` loop; a development launch logs the rest once each, such as a key no entry has or a parent that is not a submenu. Nothing throws: an override that cannot apply is skipped.

  With no active profile, every menu entry that opens a screen needing a profile now shows as disabled with the reason, Pick or create a profile first, as Home already did, instead of looking enabled and opening nothing.

  The review's menu checks follow the effective menu: the built-in entries and the last group are read where the overrides put them, a hidden screen is no longer expected in the menu, each overridden entry gets a `menu-entry-<key>` check that it is out of the menu, or drawn at its place between its neighbours, and each hidden entry a `search-hidden-<key>` check that the palette does not list it.

### Patch Changes

- f0510ca: Tessera 0.37.1 draws the splash wordmark. `BootFailureSplash` passes `product.icons.wordmark.dark` to Tessera's `Splash` as `wordmark`, so the heading is a real image named by the app name, and its own `BootFailureSplash.css` and wordmark helpers are gone. The static splash page writes `<img class="ts-wordmark">` and drops Brock's `.splash__wordmark` rules for Tessera's. Both splashes look as before. brock-react's Tessera peer range is `^0.37.1`.
- Updated dependencies [a0eedd2]
- Updated dependencies [7f76f4f]
- Updated dependencies [9ff1b40]
  - @drizztdourden08/brock-lint-config@0.49.0
  - @drizztdourden08/brock-core@0.49.0
  - @drizztdourden08/brock-thread@0.49.0

## 0.48.0

### Minor Changes

- 367a4cb: Screens, widgets, title bar handlers and tour steps load on first use, so a dev boot loads only what the shell draws. `.brock/screens.ts`, `.brock/screens.dev.ts` and `.brock/widgets.ts` import each file's `meta` and hand its component over as `lazyComponent(() => import(<file>))`; settings pages stay eager. A new renderer Vite plugin, `brock-meta-modules`, serves those meta imports from `<file>?brock-meta`: the file cut down to its `meta` and `order` exports and what they reach, read with TypeScript and never run, falling back to the whole file when it cannot be cut. The authoring convention does not change. brock-react adds `lazyComponent`, `lazyLoads` (`track`, `idle`, `isIdle`, `pending`), `preloadRoute` and `LazyHost`, one Suspense boundary with a delayed Tessera spinner around the screen content in `ScreenHost`, the page body in `HubPageFrame` and the widget body in `WidgetBody`. The shell preloads the base and home screens at mount, `first-frame` waits for the loads it started, and pointing at or focusing a menu row, a hub nav entry or a bucket pill preloads that screen or page. A title bar `button` spec with literal looks becomes `lazyTitleBarButton(look, load)` and loads its handler on the first click; a tour with a literal title becomes `lazyTour(shell, load)` and loads its steps when it starts (`tours.load(id)`, and `TourDef.load`). The review's settle step and the search jump wait for lazy loads. Top-level code in a screen or widget file now runs when it first loads, not at boot. Production builds one chunk per screen and widget.

### Patch Changes

- @drizztdourden08/brock-core@0.48.0
- @drizztdourden08/brock-lint-config@0.48.0
- @drizztdourden08/brock-thread@0.48.0

## 0.47.0

### Minor Changes

- 6ead199: A product wordmark. `product.icons.wordmark` names the app's name drawn as an image, an SVG or PNG under `public/` given as a path like the logos (`'./logos/wordmark.svg'`), or `{ src, dark }` with a variant for the dark splash ground. `defineProduct` resolves it to `{ src, dark }` (`dark` defaults to `src`, new types `ProductWordmark`, `ProductWordmarkInput` and `ProductIconsInput`) and refuses a file that is not `.svg` or `.png`. When it is set, the boot splash and its failure screen, the window's failure splash (`BootFailureSplash`) and the Setup splash `brock package` renders show the `dark` image in place of the name text, and the About window shows `src` as its heading (`AboutPanel` takes `wordmark`). The image keeps the name as its accessible name. Unset, nothing changes. The splash page uses `ts-wordmark` ahead of Tessera shipping it and sizes the image itself until then; the window's failure splash paints the image over the name text until Tessera's `Splash` takes a wordmark image.

### Patch Changes

- Updated dependencies [6ead199]
- Updated dependencies [bdf91d0]
- Updated dependencies [d8d344e]
  - @drizztdourden08/brock-core@0.47.0
  - @drizztdourden08/brock-lint-config@0.47.0
  - @drizztdourden08/brock-thread@0.47.0

## 0.46.0

### Minor Changes

- 3df3667: The renderer dev server pre-bundles what Brock can find before the first page loads, so a cold start runs Vite's dep optimizer once instead of finding dependencies as the page asks for them, re-running it and reloading. `defineBrockViteConfig` sets `optimizeDeps.include` on the dev server: React and `react-dom/client`, the renderer entries of Tessera and of the Brock packages installed in `node_modules`, and every package import of the files under `src/` and of the linked workspace packages they reach (deep icon imports and the imports of worker files included; an import only a linked package can resolve is written `<linked> > <dep>`). The new `build.optimizeDeps` in `brock.config.ts` takes `include`, `exclude`, `entries` and `worker`, the dependencies only a renderer Web Worker imports that the source read cannot see (`worker: ['fs', 'crypto', 'path']` with `nodePolyfills`).
- 025bcf7: Title bar items in the order an app chooses. A `src/title-bar/<id>.action.ts` file may export `order` (`export const order = 2`) or `meta: TitleBarItemMeta` with `order`, as screens do; `brock sync` carries it into `.brock/title-bar.ts`, and `titleBarFromFiles` puts the items with an order first, in that order, then the rest by id. Files without one keep the id order, so renaming files to order them is no longer needed.

### Patch Changes

- 3df3667: A dev boot no longer clears Chromium's HTTP cache every time, which threw away the pre-bundled dependency chunks. Main keeps the cache while the renderer's dep optimizer hash (in the `_metadata.json` the dev server names in `BROCK_DEV_DEPS_METADATA`) is the one of the last dev boot, and clears it once when the hash changes. `BROCK_DEV_CLEAR_CACHE=1` clears it on every dev boot, as before. Edits still show at once: Vite serves source modules and `public/` files with `no-cache`.
- Updated dependencies [b1026b9]
- Updated dependencies [025bcf7]
- Updated dependencies [b1026b9]
- Updated dependencies [c68c54a]
  - @drizztdourden08/brock-core@0.46.0
  - @drizztdourden08/brock-lint-config@0.46.0
  - @drizztdourden08/brock-thread@0.46.0

## 0.45.1

### Patch Changes

- 4ec937c: `launchAppForTest` and `assertLaunchable` no longer refuse a built main over a specifier that sits in text. The import check now tokenizes each built file and reads `import`, `export ... from`, `import()` and `require()` from the code only, so a `require('./package.json')` inside a string, template text, a comment or a regular expression (such as a workflow template bundled into main) is ignored.
  - @drizztdourden08/brock-core@0.45.1
  - @drizztdourden08/brock-lint-config@0.45.1
  - @drizztdourden08/brock-thread@0.45.1

## 0.45.0

### Minor Changes

- a85efb2: The Capacitor host reports the edge of the back gesture: `device.onBackButton` gets `left` or `right` from the `brock:back` event the Android `MainActivity` dispatches, and the app exits when nothing listens. The Android scaffold writes that activity in place of Capacitor's empty one (with `android:enableOnBackInvokedCallback` in the manifest), and leaves an activity with code of its own alone; run `platform add android` again to add it to an existing app.
- aba2001: Packaging takes more from the product. The Windows exe gets its version info stamped beside the icon: company from `product.author`, product name and file description from `product.name`, `LegalCopyright` from the new `product.copyright` (else the year and the author), comments from `product.description`, and the app version. `product.linuxCategory` (a main freedesktop category such as `Game`) sets the deb's and the AppImage desktop entry's category, and the AppImage entry gets the description as its comment. A file association takes a `description`: the Linux mime comment, the Windows ProgId tooltip and electron-builder's association description.
- fb41dd1: Workflow steps can target one job: a step's `jobs` (one id or a list) keeps it to those jobs of its point, `quality`, `review`, `web`, `changes` or `workspace` in CI and `prepare` or `build-<platform>` in the release. The new `release.prepare` point runs in the `prepare` job after the install, before its release note check and lint.

### Patch Changes

- 18bd938: A main process worker imported with `?modulePath` now builds. The managed main config named `electron/main.ts` as a library entry, which made electron-vite's worker bundle return one output per library format and stopped the build; it is now a build input, so `import workerPath from './job.worker?modulePath'` gives a file beside `main.js` that `new Worker(workerPath)` and port-kit's `runAssetWorkerJob` start. A test builds such a worker through the managed config and runs it.
- Updated dependencies [ef96908]
- Updated dependencies [a85efb2]
- Updated dependencies [aba2001]
- Updated dependencies [63cb77f]
- Updated dependencies [fb41dd1]
  - @drizztdourden08/brock-core@0.45.0
  - @drizztdourden08/brock-thread@0.45.0
  - @drizztdourden08/brock-lint-config@0.45.0

## 0.44.0

### Minor Changes

- 716553d: `@drizztdourden08/brock-build/testing` exports `waitForAppPage(app, timeoutMs?)` and `pageKindOf(url)`, so a test that launches the app itself waits for the app window instead of taking the splash from `firstWindow()`. `launchAppForTest` takes `userData`, the app's own profile folder with the test's fixtures, which `close()` leaves in place.

### Patch Changes

- 716553d: A dev launch no longer gets stuck on the splash. The splash plugin loaded brock-core through `vite.runnerImport` on every `index.html` and `splash.html` request, which took over 20 s inside a busy dev server; it now works the look out once per dev server, starting when the server starts, and again only when `brock.config.ts` or a file it reads changes. When the renderer answers after the boot watchdog fired (a heartbeat, progress, or a late `boot:ready`), main clears the watchdog's failure, the splash goes back to the progress and the app is revealed as usual; the app window's `did-finish-load` now counts as a sign of life too. The development watchdog waits 120 s instead of 30 s.
- Updated dependencies [716553d]
  - @drizztdourden08/brock-core@0.44.0
  - @drizztdourden08/brock-lint-config@0.44.0
  - @drizztdourden08/brock-thread@0.44.0

## 0.43.0

### Minor Changes

- f2d84fd: A new file kind for text reproduced word for word from an outside source, which the app must show exactly as it is (a licence text, a game's own dialogue table, the strings a protocol defines): `/* @layer <layer> @kind verbatim @source <short text> */`. A verbatim file gets everything `@kind data` gets (no 200-line cap, several exports, `UPPER_SNAKE` consts, and `brock/data-only` keeps it to data), and in addition the dash, punctuation and prose rules skip its string values through the standards `verbatimText` option, with the source as the `why`. Identifiers, comments, the header and vendor names are still checked, and an ordinary `@kind data` file keeps every prose rule. The new `brock/verbatim-source` rule fails a verbatim header without `@source`, and `brock structure` lists every verbatim file with its source so a review sees what is exempt. `@drizztdourden08/brock-lint-config/data-files` exports the list. Needs `@drizztdourden08/standards` 0.10. See `docs/app-structure.md`.

### Patch Changes

- Updated dependencies [f2d84fd]
  - @drizztdourden08/brock-lint-config@0.43.0
  - @drizztdourden08/brock-core@0.43.0
  - @drizztdourden08/brock-thread@0.43.0

## 0.42.0

### Patch Changes

- @drizztdourden08/brock-core@0.42.0
- @drizztdourden08/brock-thread@0.42.0

## 0.41.0

### Patch Changes

- Updated dependencies [8300ee8]
  - @drizztdourden08/brock-core@0.41.0
  - @drizztdourden08/brock-thread@0.41.0

## 0.40.0

### Patch Changes

- Updated dependencies
- Updated dependencies [9b081a6]
- Updated dependencies [ae74556]
- Updated dependencies [fb285af]
- Updated dependencies [ae74556]
  - @drizztdourden08/brock-core@0.40.0
  - @drizztdourden08/brock-thread@0.40.0

## 0.39.0

### Minor Changes

- 472754d: An app adds its own steps to the managed CI and release workflows in `brock.config.ts`, `workflows.steps`, so `brock sync`, `brock build` and `platform add` keep them. Steps go in at fixed points: `ci.beforeInstall`, `ci.beforeBuild`, `ci.afterBuild` and `ci.beforeTest`, and `release.beforeInstall`, `release.beforePackage` and `release.afterPackage` (a file copied into `upload/` there ships with the release). A step takes `run` or `uses` (with `with`), `env`, `if`, `shell`, the repository `secrets` it reads (each set as an environment variable of the step), and `os` and `platforms` to keep it to some runners or platform jobs. Modules (`brock.workflows` in their manifest) and the repo command's plugins (`definePlugin({ workflows })`) add steps the same way, before the app's. `workflows: { ci: 'own' }` or `{ release: 'own' }` leaves that file to the app: `brock sync` stops writing it and `brock check` stops comparing it.
- 472754d: `build.define` in `brock.config.ts` replaces globals at build time in main, preload, the renderer, its workers and the web build. Each value is a JSON value, written into the code as it is in the config.
- 472754d: `packaging` in `brock.config.ts` adds to the managed electron-builder config and to `vpk pack`: `extraResources` from the app folder, an `afterPack` module of the app that runs after Brock's own hook, a macOS `role` and an `icon` per file association, and `velopackIcons` for the icon `vpk pack` takes on Windows and Linux.
- bcd0321: In a repo of several apps the shared workspace `ci.yml` runs the steps of every app, in workspace order, each named `<app>: <step>`, a shell step with `working-directory` and `APP_DIR` set to its app, and the plugins' steps once. `workflows: { ci: 'own' }` in `brock.workspace.mjs` leaves that shared file to the repo; an app's own `workflows` setting covers only its own files. A `uses` step of the same action, version and inputs runs once per job, however many apps or modules declare it.
- 472754d: `brock.site.ts` takes `tsconfig.compilerOptions`, merged over the managed site `tsconfig.json`, and `build.define`. The managed site tsconfig allows `.ts` imports, so `brock.site.ts` can read its port offsets from a constant the repo shares, such as `import { TOOL_PORTS } from '../../ports.constants.ts'`.
- 472754d: `tsconfig.compilerOptions` in `brock.config.ts` merges over the managed `tsconfig.json`, key by key, with `paths` merged entry by entry, so an app can turn an option off while it fixes its errors without a hand edit that `brock check` would flag. Without it the managed file is unchanged.

### Patch Changes

- cbe389d: The managed electron-builder config puts `author` (`{ name, email }` from `product.author`) into `extraMetadata` beside `homepage`, so an app's `package.json` need not repeat it.
- 472754d: A main or preload chunk with an import line inside a template literal builds as written: electron-vite put its CommonJS shim inside the literal, and Brock now moves it after the last import statement. `brock check` fails, and `brock sync` warns, while the app's `package.json` lacks `"type": "module"`, which the managed configs need for `import.meta.dirname`.
- cbe389d: Every Linux job of the managed workflows runs on `ubuntu-24.04`, never `ubuntu-latest`, which moves to Ubuntu 26 on 19 October 2026: the CI `changes`, `quality` and `web` jobs, the workspace and site CI jobs, and the release `prepare`, `build-linux` (the `.deb` and the AppImage), `build-android`, `build-web` and `release` jobs, as the review job already did.
- 472754d: The managed release workflow moves the repo's `base` branch (from `brock.workspace.mjs`, else `main`) to the release commit, where it moved GitHub's default branch before, so a repo that releases from an integration branch keeps its version bump there.
- 472754d: `brock site add`, `brock sync` and `brock check` warn when a site's `src` or `public` holds a folder named like its dev proxy path (`src/api` under `/api`), whose files the proxy would send to the API and leave the page blank.
- 472754d: `brock site add` names a site's views after the site (`StoreShell`, `StoreHome` and `StoreSignIn` for `apps/store`), so two sites in one repo pass Tessera's duplicate-part check. Existing sites keep their views.
- Updated dependencies [472754d]
- Updated dependencies [6d7da6d]
- Updated dependencies [6d7da6d]
- Updated dependencies [bdfc457]
- Updated dependencies [bcd0321]
- Updated dependencies [cbe389d]
  - @drizztdourden08/brock-core@0.39.0
  - @drizztdourden08/brock-thread@0.39.0

## 0.38.0

### Patch Changes

- 3387134: Standards 0.9: list names that must keep their exact spelling in the prose allow list (they now pass the identifier rule too), and a test may assert the real text its app shows.
- Updated dependencies [3387134]
  - @drizztdourden08/brock-thread@0.38.0
  - @drizztdourden08/brock-core@0.38.0

## 0.37.0

### Minor Changes

- 38244b2: A production launch reviews the current sources. `brock build --if-stale` builds only when `dist` is missing, half built or older than the app's sources (its own and those of the workspace packages it depends on), and `launch --prod` (with `--review` too) runs it first instead of reusing whatever `dist` holds.

### Patch Changes

- 38244b2: The managed CI workflows (the app's, the workspace's and a site's) also run on a push to the default branch, `base` of `brock.workspace.mjs` else `main`, where releases and release notes land straight; a newer run cancels an older one of the same pull request only.
- 38244b2: The `.deb` builds without an app's own metadata: the builder config sets `homepage` from `product.repo` (`https://github.com/<owner>/<name>`), the maintainer as `Name <email>` from `product.author`, the vendor, and the synopsis and description from `product.description`.
- 38244b2: The managed workflows run every action on its Node 24 major: `actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-artifact@v7`, `actions/download-artifact@v8`, `actions/setup-java@v6`, `actions/setup-dotnet@v6`, `pnpm/action-setup@v6`, `android-actions/setup-android@v4` and `softprops/action-gh-release@v3`. Run `brock sync` to take them; `brock check` reports the workflows as drifted until then.
- 38244b2: `brock package` never ships Electron's icon. It copies the brand icons before electron-builder on every platform and stops when the icon of this platform is missing. Linux takes `build/icons/linux/`, `<size>x<size>.png` files that electron-builder reads; it ignored the `icon-<size>.png` names of `build/icons/png/`, fell back to Electron's icon and crashed building the `.deb`.
- 38244b2: The managed setup steps no longer pin `version: 10` in `pnpm/action-setup`, which failed next to a `packageManager` field: pnpm's version comes from `packageManager` in the root `package.json` alone. `brock adopt` and `create-brock` write it from the pnpm in use, the `pnpm-package-manager` migration (0.37.0) adds it to an existing repo, and `brock check` fails while it is missing.
- 38244b2: A failed release build leaves no tag behind. The managed release workflow's `prepare` job no longer commits or tags: every build runs from the commit it checked with the version set, and the `release` job commits the version, tags it and moves the default branch only once every build succeeded, so the same version can run again. The builds still fetch the previous release for the Velopack delta.
- 38244b2: The CI review job runs on `ubuntu-24.04` with or without baselines, never `ubuntu-latest`, which moves to Ubuntu 26 from 19 October 2026: its apparmor step and the linux baselines depend on the image.
- 38244b2: The managed workflows reach git. The `.*/` rule of the standard `.gitignore` hid `.github`, so an upgrade committed green without its workflows. `brock adopt` and `brock sync` keep `!.github/` right after the rule that hides it in the repo's `.gitignore`, the `workflows-tracked` migration (0.37.0) adds it to an existing repo, and `brock check` (which the upgrade now runs) fails while git ignores a managed workflow it does not track.
- Updated dependencies [38244b2]
- Updated dependencies [38244b2]
  - @drizztdourden08/brock-thread@0.37.0
  - @drizztdourden08/brock-core@0.37.0

## 0.36.0

### Minor Changes

- 273846f: The input and display modules run on Android. Each ships a Capacitor plugin in its package: `BrockInput` drives SDL3 inside the app through a JNI library built against the same pinned SDL3 source as the desktop addon, and takes controller keys before the WebView without any change to `MainActivity`; `BrockDisplay` reads the display's rates and asks Android for a synced one through the window's preferred refresh rate. `inputApi()`, `displayApi()` and `window.api.input` and `window.api.display` return the same API on Android as on the desktop, so app code does not branch; raw and joystick capture, the bundled mapping database and window modes stay desktop only (the module READMEs list each limit). `platform add android` and `mobile build` wire the modules in `modules` into the Gradle project, a built-in module left out of `modules` stays out through `android.includePlugins`, and `doctor android` asks for the NDK and CMake the input module builds with. brock-core adds `nativePlugin` and `listenNative`, brock-react adds `exposeHostNamespace`.
- 5a819b6: An app adds its own checks to the gate with `gate.scripts` in `brock.config.ts`: `package.json` scripts, taken from the app's `package.json` when it has the script, else from the workspace root's, and a script neither declares fails. `brock gate` runs them in order (after the C format check of `gate.clangFormat`), runs every step even after a failure, and exits 1 naming the ones that failed; an app that declares none passes. The managed CI `quality` job of each app (standalone or in a workspace) runs `brock gate` after the release note check, and `<repo> upgrade` runs it in each app after the gate scripts.
- e40fe59: An app ships only its own brand's palette. `BrockApp` no longer imports every Tessera brand palette; `brock sync` writes `.brock/palette.css`, which imports the palette of `product.icons.brand` (nothing when Tessera has no palette for the brand), and the app's `src/main.tsx` imports it right after Tessera's `tokens.css`. The `brand-palette-import` migration (0.36.0) adds that import to an existing app's `src/main.tsx` once, and leaves a to-do when the renderer entry is elsewhere. New apps from `create-brock` have the import, and its first sync writes the template brand's palette.
- 5289e5d: New module `@drizztdourden08/brock-catalog` (`brock add catalog`): a content catalogue client. The app configures it once with `configureCatalog(ctx, config)`: its endpoint and headers, its schema validators, its routes, an installer per container, a size cap, an install link scheme and release hooks. The renderer reads the home, the whole list and one item over `window.api.catalog`; installs run as Brock jobs (`catalog-install:<id>`: grant, download, verify, unpack) that stream the download to a temp file, check its size and sha256 against the grant before anything is unpacked, and can be cancelled while they download; an update installs the new copy before it releases and removes the old one. The installed record lives in `Data/catalog/installed.json`, and `useCatalogInstalled`, `installedRecordOf` and `installedByName` give every screen the installed guard. Install links (`<scheme>://install/<id>?v=<n>`) are parsed strictly, held until the renderer takes them with `useCatalogLinks`, and taken from `ctx.onOpen` for the scheme the product declares in `product.protocols`. `CatalogInstallBar` draws install, update, uninstall and the live progress with Tessera parts; the app tree gains its answer under actions.
- 5a819b6: `gate.clangFormat` in `brock.config.ts` names folders or files of C sources, relative to the repo root. While it names any, `brock sync` writes a managed `.clang-format` at that root, in the house C style (two-space indent, attached braces, short ifs, loops, cases and functions on one line, `int *p`, binary operators leading a broken line, trailing comments and includes left as they are, no column limit), and `brock gate` checks every `.c` and `.h` file under them with `clang-format --dry-run --Werror`, listing the files that differ. `brock clang-format` rewrites them. The clang-format is pinned: the app or the repo adds `clang-format-node` at an exact version (`pnpm add -D -E clang-format-node`), which ships LLVM's binaries for Windows, macOS and Linux, so CI and every machine format alike, and `brock knip` counts it as used; `BROCK_CLANG_FORMAT` names another binary. Without either the C check fails and names the package.
- 5a819b6: Dev-only screens and handler groups: a file with `.dev` before its extension (`src/screens/tools/inspector.page.dev.tsx`, `src/screens/editor.card.dev.tsx`, `electron/handlers/dataset-handlers.dev.ts`) is the screen or handler group of its kind in a development build and absent from a production one. `brock sync` lists them in `.brock/screens.dev.ts` and `.brock/handlers.main.dev.ts`, which `.brock/screens.ts`, `.brock/search.ts` and `.brock/handlers.main.ts` spread, and writes those files only while a dev-only file exists. In a production build (`brock build`, the web build) the Vite configs load each `.brock/*.dev.ts` as empty lists, so neither the code nor the search entries ship, and the build stops when another file imports a `.dev` file. `brock structure` reports a hero, base or page meta file marked `.dev`, a bucket whose every screen is dev-only and a shipped tab or sub-page whose page is dev-only. An app without dev-only files gets the same generated files as before.
- 0b2da5f: An app that was never on Brock starts at the version it adopts. `brock adopt` pins `package.json#brock.version` to its own version when the repo has none (an existing pin stays) and prints it. `brock migrate` now refuses an app with no `brock.version`, in its own `package.json` or its workspace root's, with or without `--from`, and points to `brock adopt`, so the migrations from 0.1.1 on never run over code Brock did not write. `--tessera-from` alone still runs. The first-adoption path is in docs/upgrading-an-app.md.
- b8f4eed: `<app> linux push` builds the Linux AppImage in a VirtualBox VM, or in WSL and copies it in, installs its desktop entry, pins it to the dock and launches it on the VM's desktop. `<app> linux doctor` checks the ssh client, VirtualBox, the VM and its state, key-only SSH access, the Guest Additions and the build tools, and `<app> linux init` writes this machine's `~/.brock/linux/<repo>.json` and prints the one-time VM steps. The machine file never holds a password: a password-like key stops the command and every ssh call runs with `BatchMode=yes`. `linux` in `brock.workspace.mjs` sets the app, the build command, the artifact folder, extra shared folders and the launch flags.
- 6f6977d: OS integration in the product config. `product.protocols` declares deep link schemes (`my-app://install/abc`), `product.fileAssociations` gains a default mime type and a shipped Windows icon, and a `product.schemes` entry with `dir` is served from `Data/<dir>` through `protocol.handle` (`app-media://` over `Data/media`). `defineProduct` checks all three lists.

  The installer registers them: on Windows the updater's Velopack hooks write and remove the `HKCU\Software\Classes` keys, and the installer stub runs `--os-integration=register` after a portable install; on macOS electron-builder writes Info.plist; on Linux the deb's `.desktop` file and mime XML come from electron-builder, the managed post-install refreshes both databases, and an AppImage writes its own entry under `~/.local/share`.

  The running app receives each link or file from argv at launch, from a second launch through the single-instance lock (taken when the product declares a protocol or a file type, never for a named instance or an automation launch; `bootstrapApp({ singleInstance })` overrides it) and from macOS `open-url` and `open-file`. After the reveal, main hands each `OpenRequest` to `ctx.onOpen` and `bootstrapApp({ onOpen })`, and the renderer gets it through `useAppOpen` or `appOpen.on` (`app:takeOpens`, then `app:open`).

- b42b735: Brock apps release with their note. The managed `release.yml` makes the GitHub release body the note without its comment lines plus a Downloads list, names the release after the note's title, and `brock package` hands Velopack the same note (`release/release-notes.md`), so `NotesMarkdown` carries it to the updater. A new app ships `release-notes/v0.1.0.md`, filled in with its name. The `release-notes-folder` migration (0.36.0) adds `release-notes/` with a README on the format at the repo root of an existing app, once, and leaves a to-do to write the next note.
- b42b735: New `brock release-notes check [version]`, from an app or its repo root: the note of that version must exist at the repo root and follow the release note standard, with the title naming `product.name`. Without a version it checks the app's own version once the repo has a note at or below it. The managed `ci.yml` runs it in the quality job, and the managed `release.yml` runs it with the version being released before it tags, so a release without a proper note stops there.
- 0aaabeb: Brock depends on `@drizztdourden08/standards` ^0.8.0, and `brock-thread` drops its copy of the release note checker for `@drizztdourden08/standards/release-notes`: `checkReleaseNote` is the standards function, and `checkNoteFile` runs its `checkRepoNotes` for the version named, so `brock release` and `brock release-notes check` also hold every newer note in the repo to the standard.
- b42b735: Brock's own releases follow the release note standard through the reusable release workflow of standards: the root declares `@drizztdourden08/standards` and a `release-notes` script, so the version pull request carries a draft `release-notes/v<version>.md` from the changesets, publishing waits until someone rewrites it, and the GitHub release `v<version>` takes it as its body in place of one release per package.
- b42b735: A Brock workspace with several apps gets workflows per app. Each app gets `ci-<app>.yml` and `release-<app>.yml` at the repo root, and the first app also writes `ci.yml` with one `workspace` job for the repo-wide checks. A pull request builds and reviews an app only when it touches it: the new `brock affected <app folder> [base ref]` prints true for the app's own files, a workspace package it depends on, or a file outside every package. Releases tag with the new `product.releaseTagPrefix` (`'desktop-v'`, required once a repo has several apps, `v` otherwise) and read the notes from the app's own `release-notes/`; `brock release --app <name>` dispatches the app's workflow. The updater keeps to the releases whose tag starts with the prefix, so the other apps and any other tags of the repo stay out of its list. A workspace with one app keeps `ci.yml`, `release.yml` and plain `v<version>` tags.
- b42b735: The managed workflows cover a repo with several packages. In a repo with `brock.workspace.mjs`, `brock sync` in the first app under `apps/` writes `ci.yml` and `release.yml` at the repo root with `APP_DIR` set to that app, and `brock check` fails when they drift; CI runs the lint, markdown, structure and test scripts and `brock check` at the repo root. `release.yml` refuses `prerelease` with `set_latest`, makes a release full on its own while the repo has no latest release (the first one, pre-release or not), never marks a pre-release latest, and on a pre-release links the pre-release's own Windows setup when it was built in place of the small installer, which always installs the latest stable release. The workflows install with `secrets.PACKAGES_TOKEN` when the repo sets it, else the workflow token.
- 5a819b6: `build` in `brock.config.ts` sets what the managed Vite configs take, so `electron.vite.config.ts` stays one line. `build.aliases` adds import prefixes beside `@app`, each a folder relative to the app folder, for main, preload, the renderer, its workers and the web build, and `brock sync` adds them to the managed `tsconfig.json` paths; `@app` stays Brock's. `build.nodePolyfills` (`true` or the options of `vite-plugin-node-polyfills`, which the app installs and `brock knip` counts as used) puts the polyfills in the renderer and in every worker build. Workers now build as ES modules (`worker.format: 'es'`), so a worker takes dynamic imports too, and a `public/wasm/` folder is served and copied as it is.
- 1ba51ae: The review compares its screenshots with stored baselines. `--review --review-bless` stores each capture as `tests/baselines/<platform>/<capture>.png` in the app repo, named after its step without the number, and refuses while any other check of the run failed, naming them (`--force` blesses anyway); `--review --review-baselines` compares every capture with its baseline and fails the review on any differing pixel, a missing baseline, a size change or a baseline no capture used, with a diff image per failure under `diffs/` in the report folder and the results in a Baselines section of `report.md` and under `baselines` in `report.json`. `tests/baselines/baselines.json` takes a tolerance (share of pixels), a channel threshold and masks (rectangles or CSS selectors) for every capture or per capture, and any element with `data-review-mask` is masked; brock-core exports `REVIEW_MASK` to spread it. Brock masks the text it writes that changes on every run: the performance widget's values, the profiles' last-used time, the job dialog line and title bar status, the Storage page sizes and path, and the logs widget's time column. A baseline run pins device scale 1, software rendering on one raster thread, no LCD text, sRGB, reduced motion, no caret, the default window size, a fixed 1920 by 1080 area for cluster maximize and full screen, and no worktree instance name; each capture finishes running animations and waits for two equal captures in a row. `launch` gives a baseline run an emptied `.user-data-review` folder, and without `--target` launches the app whose folder it runs in. `review: { baselines: true }` in `brock.config.ts` makes the managed CI review job compare with the `linux` set on `ubuntu-24.04` under a fixed 1920x1080x24 xvfb screen, and adds a `bless` input that uploads a fresh set as the `review-baselines` artifact; in a workspace with several apps each app's `ci-<app>.yml` gets its own, with the artifact `review-baselines-<app>`.

  `cluster-fullscreen` has a built-in rule, a channel threshold of 8 with no pixel share, since Chromium rasterises its SVG icons and drop shadow slightly differently after the full screen resize; an app's own rule for it overrides it. The managed CI review job now uploads the report from `.user-data/Data/review/` at the repo root, where `launch` writes it, instead of `<app folder>/.user-data`, which found nothing for an app in a folder of a workspace; `brock sync` rewrites the line.

- e344df6: `brock site add <name>` adds a site beside the Brock app: a separate single-page web app at `apps/<name>` of the same pnpm workspace, drawn with Tessera (`TesseraProvider`, the brand palette, the tokens and its own `theme.css`), framed by Tessera's `SiteHeader` (brand, links, the profile menu as the title bar's dropdown action) and `SiteFooter`, with a sign-in page on the brand gradient. `brock.site.ts` (`defineBrockSite` from `@drizztdourden08/brock-build/site`) gives it a tool port of the app's port block in the checkout's slot, an optional `/api` dev proxy to a URL or to a port offset of the same slot, node polyfills and aliases; `brock site dev`, `build`, `preview` and `list` run it. `brock sync` writes its managed `vite.config.ts` (`defineBrockSiteConfig` from `@drizztdourden08/brock-build/vite-site`), `tsconfig.json` and its own `ci-<name>.yml`, gated by `brock affected`, and `brock check` reports their drift. The site joins `tessera.config.json`, `knip.json` and the Tessera guide, and the lint preset takes `brock.site.ts` as a default-export file. Brock adds no server kit, functions, hosting deploy or sign-in layer for it. `brock adopt` lists a design package's `src/views`, the views two or more apps share, beside each app's own views.
- 5116d52: `brock migrate --tessera-from-copy <folder> --map <file> [--alias <alias>]` converts an app that imports its own copy of the design system Tessera was cut from. The command holds no table of any one copy: `--map` names a JSON file (relative to the current directory) with the release the copy matches (`from`, 0.3.0 when left out), the folders of the copy and the Tessera entry point each takes (`entries`), the copy's stylesheets (`stylesheets`), the props a copy component gains (`attributes`) and rename entries added to a release (`overlay`). Named imports of the copy, relative or through an alias, take the Tessera entry of the deepest mapped folder (joined into one import per entry), then every `RENAMES.json` release after `from` replays over them, and `brock.tessera` is pinned. A copy part that shares a name with a different Tessera part takes the name the replay gave it, never Tessera's own part. Each imported name is then checked against the installed Tessera: a name another entry exports moves there, and anything that cannot be rewritten mechanically (a helper from inside the copy, a namespace import, a dynamic import or mock, a rename note, the alias config, the copy folder itself) is a numbered to-do in the report. A missing or unusable map stops the run before it touches a file. A second run changes nothing it already changed. `tesseraRenamesStep` takes `files` and a per-release `overlay` for it.
- 524dcf3: New module `@drizztdourden08/brock-tools` (`brock add tools`): external binaries an app declares, such as ffmpeg and ffprobe. `getTools(ctx).register({ id, label, binaries, version?, downloads?, resolveDownload?, usePath?, installHint? })` adds a tool; `state` finds it in `Data/tools/<id>/<version>` or on `PATH`, `install` runs the `tool:<id>` job (download through `net.fetch`, size and SHA-256 check, unpack from zip, tar or a bare file, one rename into the cache), and `run` spawns a binary with an argument array, a timeout and a line callback. The renderer gets `window.api.tools` and `useTool(id)`. brock-electron exposes its zip reader and writer as `@drizztdourden08/brock-electron/zip`, and `brock add` knows the `tools` id.

### Patch Changes

- c530ec5: Brock's own releases carry a release note. The `release` workflow passes `release-notes` to the reusable workflow of standards, so the version pull request holds a draft `release-notes/v<version>.md` for the one version all Brock packages share, publishing waits until the draft is rewritten and passes the check, and the GitHub release `v<version>` takes the note as its body. The README gives the steps: after the version pull request opens, write the note on its branch, check it with `pnpm release-notes check`, then merge.
- f0e104c: Brock keeps one Capacitor config, the managed `capacitor.config.json` at the app root, and supports no `capacitor.config.ts`. The Capacitor CLI loads a `.ts` or `.js` config before the JSON, so one left beside it would silently replace the managed file: `platform add android` now fails on its first step while either sits at the app root, and names what to do. docs/upgrading-an-app.md (Android) gives the move for an app with `apps/mobile/capacitor.config.ts`: the Android project into `mobile/android`, the plugins into the app's `package.json`, the `build.gradle` paths, version and signing variables, then `platform add android` and `cap sync`.
- adc0d5c: A production build strips the dev-only screens and handler groups again when the app folder is reached through a link, a junction or a short Windows name (`C:\Users\RUNNER~1\...`, the temp folder on GitHub's Windows runners). Vite hands `devOnlyPlugin` the real path of each file, which lay outside the app root as given, so `.brock/*.dev.ts` shipped whole and an import of a `.dev` file built instead of stopping. The plugin now matches a file against the app root as given and its real path.
- e40fe59: Examples name no app of their own. `defineProduct`'s message for a file extension written with a dot gives `mypack` as its example, the package READMEs use neutral names (`my-app`, `api-token`, an `account` sign-in, `codegen:check` as a gate script), and the move steps in docs/upgrading-an-app.md are a general checklist.
- 5345962: An app whose main process and renderer sit in two folders (such as `apps/desktop/electron` and `apps/web/src`) moves them into one app folder; Brock adds no setting for other `electron` or `src` paths, since every scanner, managed config and check reads them beside `brock.config.ts`. docs/upgrading-an-app.md gives the move step by step: the aliases other than `@app` out first, the renderer into the folder that holds `electron/`, the paths that named the old places, the Brock skeleton created beside the app and merged in, and the old web folder and root Vite config removed.
- 956b72b: `brock sync` writes `.brock/tessera.ts`, a type import of the Tessera entry module, in every app that has Tessera. A `declare module '@drizztdourden08/tessera'` block, such as the parts module `tessera guide` writes, only resolves when the Tessera entry file is already in the program, and an app whose own files import Tessera through subpaths never loaded it; in an app scaffolded with `--local`, where the Brock packages are links that import their own Tessera copy, `tsc` and `pnpm lint` failed with TS2664 ("Invalid module name in augmentation") as soon as the guide wrote any part. A fresh app ships the file, and the next `brock sync` adds it to an existing one.
- 7fc554a: Each worktree has its own base branch, so a repo can run a whole migration on an integration branch while its main branch keeps moving. `worktree create --base <branch>` sets it and starts the worktree there; a `--from` that names an origin branch makes that branch the base unless `--base` says otherwise. The base is stored in git config as `branch.<branch>.brockBase`, so it follows the branch through `finish`, a resume and a rename, and goes with `git branch -D`. `refresh --rebase` rebases on it, `pr open` opens the PR into it, `pr status` says when the PR targets another branch, and `finish` and `remove` treat the branch as landed once its commits are on the base, then delete it instead of leaving it behind. `worktree base [name] [<new base>]` shows or changes it. A branch that another branch names as its base is never deleted with a worktree. A worktree made before this has no entry and keeps the workspace base; after a fresh clone, resuming a branch takes the base of its open PR.
- Updated dependencies [273846f]
- Updated dependencies [5a819b6]
- Updated dependencies [aa74a6d]
- Updated dependencies [34ef26d]
- Updated dependencies [b8f4eed]
- Updated dependencies [e40fe59]
- Updated dependencies [6f6977d]
- Updated dependencies [e40fe59]
- Updated dependencies [0aaabeb]
- Updated dependencies [b42b735]
- Updated dependencies [b42b735]
- Updated dependencies [1ba51ae]
- Updated dependencies [7fc554a]
  - @drizztdourden08/brock-core@0.36.0
  - @drizztdourden08/brock-thread@0.36.0

## 0.35.0

### Patch Changes

- @drizztdourden08/brock-core@0.35.0
- @drizztdourden08/brock-thread@0.35.0

## 0.34.0

### Minor Changes

- 2bb99b9: `src/tours` takes constants files beside the tours: `<id>.tour.constants.ts`, the file the constants lint rule names for a constant in `<id>.tour.ts`, and `<name>.constants.ts` for constants several tours share. `brock structure` no longer reports them, and `brock sync` leaves them out of `.brock/tours.ts`. Before, lint asked for the constants file and the structure check refused it, so a tour's selector had to live in `src/hooks`.

### Patch Changes

- 2bb99b9: The app tsconfig includes `.brock/*.ts` instead of `.brock`. TypeScript skips dot folders when it expands a folder entry in `include`, so `.brock` matched no file, and `.brock/tessera-parts.ts`, the `guide.parts` file a fresh app sets, never reached the program because nothing imports it. `brock sync` writes the new tsconfig, and the `brock-dir-type-checked` migration (0.34.0) rewrites a bare `.brock` include entry in every `tsconfig*.json` at the app root.
- 55d8b24: `brock structure` accepts the constants file the constants lint rule names in every convention folder, as it already did in `src/tours`: `<id>.widget.constants.ts` and `layout.constants.ts` in `src/widgets`, `<id>.action.constants.ts` in `src/title-bar`, `<id>.<kind>.constants.ts` (such as `library.page.constants.ts`) at any level of `src/screens`, and `<name>.constants.ts` for constants several files there share; `brock sync` leaves them out of `.brock`. Module folders take `<id>.task.constants.ts` beside a boot task and `<id>.step.constants.ts` beside a review step. Before, lint asked for these files and `brock structure` refused them.
- 2bb99b9: `brock sync` in a workspace app runs `tessera guide` where Tessera is installed. It still reads the workspace's `tessera.config.json`, but runs Tessera in that folder only when it has Tessera, else in the first workspace package outside the `apps` entries that has it (such as `packages/design`), else in each `apps` entry with Tessera. Before, it ran at the repo root, where Tessera reported itself not installed, so the part names were never written by a sync from `apps/desktop`.
- 2bb99b9: `brock migrate` replays Tessera's `RENAMES.json` over every workspace package that depends on Tessera, found from the `pnpm-workspace.yaml` globs, instead of every folder under `apps/` and `packages/`. A Tessera package in another folder (`tooling/*`, say) is covered now, and a package that does not use Tessera is no longer touched by a class or custom property rename.
- 08e0cd1: A dev launch (the review's included) leaves `dist/electron/main.js` without a built renderer, and a later `brock start` opened a blank window. `brock start` now spots that half build (no `dist/renderer/index.html`, or one older than main) and runs `brock build` first. `launchAppForTest` and `assertLaunchable` throw with the reason instead of opening a blank window, and `launch --prod` refuses with it.
- 55d8b24: `brock migrate` replays Tessera's component renames into usage files (`<Name>.usage.ts`, which `tessera guide` reads): the part each `avoidWhen` entry names in `use`, such as `use: 'ManagedList'`, becomes `use: 'ItemList'`, and a note there becomes a to-do. The `example` string replays as code of its own, so its Tessera import, the tags and references it holds and the release's entry point moves follow. No other string in a usage file changes, and a `use` key anywhere else is left alone. Before, after an upgrade the guide reported `avoidWhen names ManagedList` and could not compile the example.
- 2bb99b9: `brock structure` accepts `context` in a widget file's `meta`. `WidgetMeta` has taken it since the context registry, but the list of widget fields the structure check reads did not, so a widget that named its context was reported as having a field that is not a widget field.
- Updated dependencies [08e0cd1]
- Updated dependencies [08e0cd1]
  - @drizztdourden08/brock-core@0.34.0
  - @drizztdourden08/brock-thread@0.34.0

## 0.33.0

### Patch Changes

- @drizztdourden08/brock-core@0.33.0
- @drizztdourden08/brock-thread@0.33.0

## 0.32.1

### Patch Changes

- @drizztdourden08/brock-core@0.32.1
- @drizztdourden08/brock-thread@0.32.1

## 0.32.0

### Patch Changes

- Updated dependencies [92b662f]
  - @drizztdourden08/brock-core@0.32.0
  - @drizztdourden08/brock-thread@0.32.0

## 0.31.0

### Patch Changes

- @drizztdourden08/brock-core@0.31.0
- @drizztdourden08/brock-thread@0.31.0

## 0.30.0

### Patch Changes

- Updated dependencies [f0d71bd]
  - @drizztdourden08/brock-core@0.30.0
  - @drizztdourden08/brock-thread@0.30.0

## 0.29.1

### Patch Changes

- 5ad5e24: The Tessera renames replay now reads `props` keys that end in `*`, such as Tessera 0.23.1's `CommandInput.aria-*`, `CommandInput.on*` and `CommandInput.*`, which it used to skip. Such a key covers every prop of that component starting with the text before the `*`. An exact key still comes first, then the longest matching prefix, and a prop the component still takes is left alone, read from the installed Tessera's types (the props type of the JSX tag or of the object literal), else from a `keep` list in the release, else the to-do says to check it. The value is always a note, so each covered prop becomes a to-do and is never renamed. This works on JSX attributes and on object literals typed as the props type; an exact `Component.prop` key now also reaches an object literal typed as `ComponentProps`. A `props` value that is a bare prop name (`label`) is a rename to that prop of the same component on JSX attributes too, so `CommandInput.aria-label` becomes `label` instead of a to-do.
  - @drizztdourden08/brock-core@0.29.1
  - @drizztdourden08/brock-thread@0.29.1

## 0.29.0

### Patch Changes

- @drizztdourden08/brock-core@0.29.0
- @drizztdourden08/brock-thread@0.29.0

## 0.28.1

### Patch Changes

- Updated dependencies [8c8d415]
  - @drizztdourden08/brock-core@0.28.1
  - @drizztdourden08/brock-thread@0.28.1

## 0.28.0

### Patch Changes

- Updated dependencies [c426f9a]
  - @drizztdourden08/brock-core@0.28.0
  - @drizztdourden08/brock-thread@0.28.0

## 0.27.0

### Minor Changes

- f704655: Guided tours are part of every Brock app, drawn by Tessera's `GuidedTour` and presented by the app's brand mascot. A tour is a file: `src/tours/<id>.tour.ts` default-exports `defineTour({ id, title, steps, trigger? })`. `brock sync`, `brock dev`, `brock build` and the renderer Vite plugin write `.brock/tours.ts`, `BrockApp` takes it as `tours`, and `RendererModule.tours` adds a module's tours. `brock structure` checks the folder, and `brock-lint-config` lets tour files default-export.

  A step lights a Tessera target or a Brock one (`{ shell: 'menu' | 'search' | 'report-bug' | 'title-bar' | 'screen' }`, `{ widget: '<id>' }`, `{ setting: '<key>' }`). Before it shows it can `open` a screen or hub page, open a `widget`, set a `context` and run `before(ctx)`, which may be async. `advanceOn` waits for a click (`{ click: target }`), a tour event (`tours.emit(name)`) or a context change. Each step can name the mascot's state.

  `tours.start(id)`, `tours.stop()`, `tours.next()`, `tours.back()` and `useTour()` drive tours. Completion and the last step are kept per profile in `ui-views.json`, so a finished tour doesn't come back by itself. `trigger: 'first-run'` starts a tour once, the first time a profile opens the app, after the boot and the splash. Menu > Take the tour (in Help when the app has a Help group, else in Advanced) and a search palette action per tour start them. Escape closes a tour, and the other shell shortcuts wait while one is open. The title bar stays usable over the tour. The menu knows a `help` section.

  The review gets a `tours` step: it runs every tour end to end, clicks through interactive steps, captures each step and checks that the tour is kept as completed and that Escape closes it.

  The template ships `welcome.tour.ts`, a four-step first-run tour of the menu, the search, the Notes widget (which waits for a click) and Settings. The 0.27.0 `tour-files` migration adds `tours={appTours}` and its import to `src/main.tsx`.

### Patch Changes

- @drizztdourden08/brock-core@0.27.0
- @drizztdourden08/brock-thread@0.27.0

## 0.26.0

### Minor Changes

- 0204060: `SettingAction` takes `tone` in place of `variant`, named as in Tessera's `ActionData` (variant became tone on every action shape in Tessera 0.21). `tone` is a `ButtonVariant`: `'danger'` gives the settings row its danger tone and a string `confirm` dialog its danger look, and `SettingActions` draws its buttons in it. `variant` is a deprecated alias that still works until 0.27; when both are set, `tone` wins. The Storage page's Clear action uses `tone`.

  The 0.26.0 migration `setting-action-tone` rewrites `variant:` to `tone:` in the settings actions of an `actions: [...]` list (a JSX `actions` prop and mapped entries too) and in objects typed `SettingAction` by an annotation, a return type, `as` or `satisfies`. The `variant` of a `confirm` dialog stays. An object with `label`, `onSelect` and `variant` it cannot place, and an action that sets both, become to-dos. A second run changes nothing.

  The template's General page shows a row action: Widget layout, with a Reset in the danger tone that asks first.

### Patch Changes

- 0204060: The Tessera renames replay now renames props of object literals typed by their context. A `props` key on a type, such as `SettingsRowAction.onClick` to `onSelect`, renames the prop, method or shorthand of each object literal whose contextual type from the TypeScript checker (else its own type) is that Tessera type: under an annotation, `as` or `satisfies`, a function's return type, a call argument, an array element or a JSX prop value. Before, nothing renamed those props. A note in place of a name is a to-do on the prop. The checker runs once per release, over only the files with an object literal holding a prop some key names, asks only those literals, and shares the files it reads beside them between releases.
  - @drizztdourden08/brock-core@0.26.0
  - @drizztdourden08/brock-thread@0.26.0

## 0.25.0

### Minor Changes

- 8903da0: Brock moves to Tessera 0.21.0: the workspace catalog and brock-react's peer range are `^0.21.0` (MIGRATION §181 to §191). `brock upgrade` from 0.24 replays RENAMES.json (ManagedList to ItemList, MasterDetail to ListDetail, ContentHeaderBack to BackAction, `onClick` to `onSelect` and `variant` to `tone` on the action shapes, ToastContainer to ToastStack, the removed JsonInput, NamedRange and SetPicker, and the merged strings). The profiles list is Tessera's `ItemList`, and SettingsRow actions take `onSelect`.

  `ScreenLayer` takes `back`, Tessera's `BackAction` `{ onSelect, label? }`, in place of `onBack`. The shell passes the page Back goes to as the label, the hub page or sub-page of the last history step, else the screen title, so the arrow reads Back to Saves. The 0.25.0 migration `screen-layer-back` rewrites `<ScreenLayer onBack={fn}>` to `back={{ onSelect: fn }}` and lists an `onBack` it cannot rewrite as a to-do.

- 8903da0: Toasts go through Tessera's one queue. `ToastHost` is a single `ToastStack` at the bottom right with `max={3}`, and `toast(message, { variant, duration, action })` and `dismissToast(id)` are thin wrappers over Tessera's `toast()` and `toast.dismiss()`. The same message and variant raised again joins the toast already shown, with a count such as ×2, and a toast with no `duration` leaves after Tessera's 5 s, where Brock's own default was 4 s. `useToastStore` and `ToastState` are removed: the 0.25.0 migration `toast-store-gone` lists each use as a to-do.

### Patch Changes

- 8903da0: The Setup splash sets the app name in Tessera's TrueType title font, `fonts/chakra-petch/chakra-petch-latin-600-normal.ttf`, which Tessera 0.21 ships beside the WOFF2 file. resvg loads it straight from the package with the system fonts, by the family it declares, `Chakra Petch SemiBold`, so Brock's own WOFF2 to TrueType converter is gone. Segoe UI stays the fallback.
  - @drizztdourden08/brock-core@0.25.0
  - @drizztdourden08/brock-thread@0.25.0

## 0.24.1

### Patch Changes

- @drizztdourden08/brock-core@0.24.1
- @drizztdourden08/brock-thread@0.24.1

## 0.24.0

### Minor Changes

- 88977ee: `brock upgrade` and `brock migrate --tessera-from` replay the entry point moves Tessera's `RENAMES.json` records in each release's `moves` map:

  - After a release's renames, its moves are grouped by `from` and `to` (package.json `exports` subpaths) and every import or re-export of a moved name through `@drizztdourden08/tessera/<from>` takes it from `@drizztdourden08/tessera/<to>`. A part renamed in the same release moves under its new name. The root import never moves.
  - `importMoves` reads any exports subpath, not only `primitives`, `composites` and `brand`, so `data`, `field-kits` and the others move too.
  - `importMoves` moves `export { … } from` re-exports as well, and moves the named imports out of an import that also takes a default, which stays where it is. It takes an optional `ts`, a TypeScript compiler already loaded.
  - A name the new entry already imports is dropped from the old import, never written twice, so the published `tessera-part-moves` (0.19.0) and `tessera-tier-moves` (0.23.0) migrations and the moves replay give the same imports in either order and on any rerun.

### Patch Changes

- 43791e4: The installer's Setup splash (`build/installer-splash.png`) now sits on the same dark ground as the boot splash. It drops the white radial glow and the shadow behind the mark, and paints the palette's dark gradient (`gradientDarkFrom` to `gradientDarkTo` in Tessera's `tokens.json`, the values of `--c-gradient-dark-from` and `--c-gradient-dark-to`). An app with colours of its own gets the `--look-dark-from` and `--look-dark-to` pair from `darkPair`, and a dark pair set in `theme.css` comes next. The mark comes from Tessera's `brand/dark-ground/`. The app name is in the palette's dark text, which must hold 4.5:1 at both ends of the gradient; if it doesn't, the name falls back to white or black, whichever reads better. The name is set in the boot splash's title font, Tessera's Chakra Petch, and falls back to Segoe UI only when that font file can't be read. `brock icons` now draws the Setup splash too for an app that ships to Windows, so you can check it before a release. The installer's downloader window keeps the bright look across its top.
  - @drizztdourden08/brock-core@0.24.0
  - @drizztdourden08/brock-thread@0.24.0

## 0.23.0

### Minor Changes

- e769096: Brock moves to Tessera 0.20.0: the workspace catalog and brock-react's peer range are `^0.20.0` (MIGRATION §170 to §180). `brock upgrade` from 0.22.0 replays RENAMES.json (ChosenMascot to AnimatedMascot, PathField to PathInput, the removed parts, the eighteen Glyph names, StatRow `copyable`, CommandPalette `sentri` to `rotp`), and two 0.23.0 migrations cover what it does not:

  - `tessera-tier-moves` moves imports of the parts that changed entry point: Splash, Toast, ToastContainer, ShortcutList, CodeBlock, Video, RetryButton, CommandInput, PasswordInput, TagInput and PathField (with their types) from `/primitives` to `/composites`, Overlay to `/primitives` and PixelWordmark to `/brand`. RENAMES.json names no entry point, so an import that only got renamed would point at the wrong one. The root import is left alone.
  - `menu-confirm-store` lists each use of the removed `useMenuConfirmStore`, `MenuConfirmState` and `MenuResolver.armed` as a to-do.

  The replay no longer flags every import of `Text` for the removed `Text.CodeBlock`: a removed member is a to-do only on the lines that use it.

### Patch Changes

- e769096: The splash sits on Tessera's dark gradient, with text that holds WCAG AA. The splash page and the boot failure splash drop Brock's white radial highlight, the light drop shadow on the mark and the bright look under the text, so Tessera paints the palette's `--c-gradient-dark-from` to `--c-gradient-dark-to` under its tested text colours. Only an app with colours of its own (`product.look`, or palette seeds in its theme without its own `--p-gradient-dark-from` and `--p-gradient-dark-to`) gets `--look-dark-from` and `--look-dark-to`, from brock-core's new `darkPair`, which darkens its look toward black until the palette's `--c-text-dim` reads at 4.5:1 at both ends. `brock icons` writes `public/logos/mark.svg` from Tessera's `brand/dark-ground/<brand>.svg`, so both splashes show the mark in its dark ground colours. The installer and its Setup splash keep the bright look.
- Updated dependencies [e769096]
  - @drizztdourden08/brock-core@0.23.0
  - @drizztdourden08/brock-thread@0.23.0

## 0.22.0

### Minor Changes

- 73a287e: A central context registry replaces the single widget context. `useContextsStore` holds named contexts, each `{ active, data? }`; the app and modules set them with `contexts.set('session', { active, data })` or `useSetAppContext('session', active, data?)` in a component, and read them with `useAppContext('session')`. A widget names the context it needs with `context: 'session'` in its definition or file `meta` (which makes it `context-only` by default) and shows only while that context is active, docked, floating and popped; module widgets register the same way as app widgets. The registry is relayed to popped widget windows, so `useAppContext` reads the same contexts there. `BrockApp`'s and `WidgetHost`'s `widgetContext` prop is deprecated but keeps working, driving the `default` context that context-only widgets with no context of their own follow; the `widget-context-registry` migration (0.22.0) lists each use as a to-do.
- 73a287e: The review copies `src/review/fixtures/` into the app data folder, at the same paths, before the seed runs, for sample files that are easier to keep as files. `brock sync` lists them in `.brock/review.ts` (`fixtures`, lazy `?url` imports), the copy reports a `fixtures-copied` check in the `seed` step, and `brock structure` leaves the folder alone. A fresh app ships `src/review/fixtures/notes/review-note.txt`, which its seed reads into the Notes widget.

### Patch Changes

- 73a287e: The `guide/` folder `tessera guide` writes is generated output: a fresh app ignores it in git, `brock dev`, `brock build` and `brock start` write it again when it is missing, and the `guide-folder-ignored` migration (0.22.0) adds `/guide/` (or the `guide.out` folders) to the `.gitignore` beside `tessera.config.json` and makes a tracked copy a to-do.
- Updated dependencies [73a287e]
- Updated dependencies [73a287e]
  - @drizztdourden08/brock-core@0.22.0
  - @drizztdourden08/brock-thread@0.22.0

## 0.21.1

### Patch Changes

- @drizztdourden08/brock-core@0.21.1
- @drizztdourden08/brock-thread@0.21.1

## 0.21.0

### Patch Changes

- @drizztdourden08/brock-core@0.21.0
- @drizztdourden08/brock-thread@0.21.0

## 0.20.0

### Patch Changes

- @drizztdourden08/brock-core@0.20.0
- @drizztdourden08/brock-thread@0.20.0

## 0.19.0

### Minor Changes

- df9c1df: Brock moves to Tessera 0.17.0: the workspace catalog and brock-react's peer range are `^0.17.0`. Small text is 12 px, and Field labels and DataTable headers are no longer forced to capitals (Archipelia review T-03). Two new settings control kinds: `path` (`pick`, `accept`, `placeholder`) draws Tessera's `PathField` on a string setting, with typing, a drop from the desktop and Browse, and `json` (`shape`) draws `JsonInput`, which saves the value only while the text parses. They come with new optional platform ports, `filePicker.pickPath`, `filePicker.pathOf` and `storage.revealLogs`, which the Electron host fills through the new `dialog:pickPath` and `debug:revealLogs` channels and the preload's `getFilePath`. `brock upgrade` writes `StatusOf` as `Status` from Tessera's `RENAMES.json`, and the `tessera-part-moves` migration moves `CopyButton`, `CopyValue` and their types from `/primitives` to `/composites`, and `ErrorBoundary` from `/composites` to `/primitives`.

### Patch Changes

- df9c1df: A renderer boot task that fails while the window shows now draws Tessera's `Splash`, the same as the boot splash page: the app name and mark, `<task> failed` with the error under it, a danger bar, the version, and Retry, Open logs (the logs folder) and Quit. It covers the window, and the app root is inert under it. The splash page draws its mark in `ts-mark` and the error in `ts-detail`, and the splash plugin puts the app look on the app page, so both splashes share the gradient.
- Updated dependencies [df9c1df]
  - @drizztdourden08/brock-core@0.19.0
  - @drizztdourden08/brock-thread@0.19.0

## 0.18.0

### Minor Changes

- 70d80cf: Brock moves to Tessera ^0.16.1 and standards ^0.7.0, which Tessera 0.16's lint extension needs. Breaking: `BackTitle` and `BackTitleProps`, `titleBarMenu`, the `focus` option of `confirmAction` and the `ConfirmFocus` type are gone, replaced by Tessera's header Back buttons, title bar dropdowns and danger dialogs; migration `shell-workarounds-removed` lists each use. StackedBar comes from the primitives, the faint text colour is gone from Brock's styles, Brock's stylesheets name no Tessera internals, and the bug report fields take the full dialog width now that Field stops at 512 px.

### Patch Changes

- 70d80cf: The generated `.brock` files are never linted: `brockEslint` ignores `**/.brock/**`, the templates list it, and migration `eslint-brock-ignore` adds it to the ESLint config of the app and of the workspace root.
- 70d80cf: `brock sync` runs `tessera guide` when `tessera.config.json` sets `guide.parts`, and a new app sets it to `.brock/tessera-parts.ts`. Migration `guide-parts` asks an app to set it and to delete a hand-written parts list (archipelia-36, brock-24).
- 70d80cf: `brock migrate` runs `brock sync` again when a Brock migration changed the app, so a file it adds, such as `session.base.tsx`, reaches `.brock/screens.ts`.
- 70d80cf: A `.settings.ts` page written as a function keeps its build-time search rows: the literal reader follows the sections the function returns.
- 70d80cf: The static splash page draws with Tessera's `splash.css` kit and keeps only its look, mark and failure layout (T-09).
- 70d80cf: Widgets use Tessera's body padding and fill: the Performance widget drops its own padding, the Logs widget uses `padding: 'none'`, `fill` and LogPanel `height="fill"`, and widget `meta` accepts `padding` and `fill`.
- Updated dependencies [70d80cf]
  - @drizztdourden08/brock-thread@0.18.0
  - @drizztdourden08/brock-core@0.18.0

## 0.17.1

### Patch Changes

- 1ebfc4c: `brock knip` counts a dependency an app declares for the Brock and workspace packages it bundles (their `dependencies` and `peerDependencies`) as used. Knip reads `package.json#main` (`dist/electron/main.js`) whenever it exists, so a fresh worktree flagged those packages as unused until a build ran, and the upgrade gate, which lints before it builds, went red. The template's `knip.json` no longer lists `@electron-toolkit/utils`, `velopack` and `zustand` in `ignoreDependencies`.
- Updated dependencies [1ebfc4c]
- Updated dependencies [1ebfc4c]
  - @drizztdourden08/brock-thread@0.17.1
  - @drizztdourden08/brock-core@0.17.1

## 0.17.0

### Minor Changes

- 3a35c8e: Main has a place for app services: `bootstrapApp(product, { services: (ctx) => createAppServices(ctx) })` builds them once, at the start of the modules boot task (after the paths, before the handlers), exposes them as `ctx.services`, typed through the new `AppServices` augmentation, and calls their `dispose()` on will-quit. Reading `ctx.services` before the build, or without the option, throws and says which. The `app-services` migration turns a WeakMap memo keyed by `MainContext` into a to-do.
- 3a35c8e: An IPC channel is declared once: `defineChannels({ engineStatus: invoke<() => Promise<EngineStatus>>()('ap:engine:status'), onProgress: event<(p: number) => void>()('ap:engine:progress') })` from brock-core gives the preload maps (`maps.invoke`, `maps.send`, `maps.events`), the augmentation types (`InvokeContractOf`, `SendContractOf`, `EventContractOf`) and typed entries: main's `handle`, `on` and `emit` take an entry in place of the channel name, and brock-react's `channelApi(APP_CHANNELS)` types the renderer calls by method name. Channels written in the augmentation, a map and a handler keep working. The new app declares its channels this way, knip treats `src/ipc/contract.type.ts` as an entry, and the `channel-declarations` migration lists, as one to-do, every channel an app could move. docs/ipc.md shows both styles.
- 3a35c8e: Handler groups are picked up by file name: `brock sync` writes `.brock/handlers.main.ts` (`mainHandlers`) from `electron/handlers/<subject>-handlers.ts`, each exporting `<subject>Handlers`, and a change in that folder makes `.brock` stale. The new app passes `handlers: mainHandlers`. The `handlers-by-file` migration rewrites `electron/main.ts` the same way when its hand list (in `electron/handlers/index.ts` or inline) names exactly those groups, removing an index that held only the list, and leaves a to-do with both lists otherwise.
- 3a35c8e: Apps add their own review steps: each `src/review/<id>.step.ts` (default export `defineReviewStep({ run })`) runs as step `<id>` after the built-in steps, in the same report. `run(tour)` gets the built-in helpers: `check`, `report`, `capture` (named `<id>-<name>`), `find`, `findAll`, `click`, `hover`, `typeText` (inputs and textareas), `press`, `waitFor`, `settle`, `delay`, `openScreen`, `openWidget`, `resetUi`, plus `platform` and `api`. A step that finishes gets a passing `step-ran` check, and an id that is a built-in step's name fails. `brock structure` accepts `<id>.step.ts` files and the lint preset allows their default export. The new app ships `src/review/notes.step.ts`.
- 3a35c8e: The review tours the app's real content: `src/review/seed.ts` (default export `defineReviewSeed({ run })`) runs as the `seed` step right after the profile step, so the screens and widgets that follow are captured with data. The seed fills the app through its own channels, a store, or fixture files written with `tour.platform.files`. `brock sync` lists it in `.brock/review.ts`, `src/main.tsx` passes `review={appReview}` to `BrockApp` (the `review-files` migration adds it), and the new app writes a note for the Notes widget. docs/review-steps.md shows how to write one.
- d358df3: A base screen is a file now: `src/screens/<id>.base.tsx`, one per app, default-exports its component (`BaseProps`) with `title` and `icon` in `meta`. `brock sync` lists it, `BrockApp` draws it under every hub, Escape closes down to it and opens `config.home` from it, and `brock structure` rejects a second one, one inside a bucket and one named like a bucket. The `base-screen-file` migration moves a hand `defineScreen` passed through `screens` and `home` into that file, or leaves a to-do naming the file when the screen holds more than a title, an icon and a component.
- d358df3: Sub-pages: `<page>/<sub>.sub.tsx` beside a page is a route under it (`meta.path`, such as `':id/edit'`), drawn in the page frame with "Back to <page>" before its title. It goes into the history, Escape and Back go up to the page, search finds the ones without params, and a page opens one with `openSub(id, params)`. `useUnsavedChanges(dirty)` asks "Discard changes?" before any navigation leaves a dirty page and adds its message to the quit confirm.
- e70afc3: An app puts its own items in the title bar without a module: `src/title-bar/<id>.action.ts` default-exports `defineTitleBarItem({ kind: 'button' | 'menu' | 'status', ... })` or a hook that returns one. `brock sync` writes `.brock/title-bar.ts` and `BrockApp` takes it as `titleBar`. A `menu` item opens a dropdown of its own, a `status` item is a tag drawn while its status is set, and every item folds into the main menu when the bar is narrow. App items come after Search, Report a bug and the module items, whose order stays fixed. The `title-bar-files` migration wires `src/main.tsx`.
- 87fa9a3: A default widget layout and Reset layout. `src/widgets/layout.ts` default-exports `defineLayoutPreset({ rows, sizes, widths })`: rows of widget ids around the `main` view, with an array of ids tabbing them in one pane. `brock sync` exports it from `.brock/widgets.ts` as `appWidgetLayout` (undefined without the file), and `src/main.tsx` passes `widgetLayout={appWidgetLayout}` to `BrockApp`. A profile with no saved layout starts from it, and `meta.defaultOpen` opens a widget the preset does not place on its default side. `widgets.reset()` and the new Reset layout entry at the end of the Widgets menu put the layout back to that default. The `widget-layout-prop` migration wires `src/main.tsx`; the template ships a layout with Notes beside the main view.

### Patch Changes

- 3a35c8e: `.brock/*.ts` stays committed, as the template and `brock adopt` already wrote it, and app-structure.md now says why: a fresh checkout type-checks without a sync and `brock check` catches a stale registry. The `brock-dir-tracked` migration adds `!.brock/` and `.brock/profile-config.json` to a `.gitignore` whose `.*/` rule hid the folder, up to the workspace root.
- 3a35c8e: `brock adopt` ignores `public/logos/mark.svg`, which `brock icons` writes beside the other logos. The `mark-svg-ignored` migration adds the line next to the other logo lines and leaves a to-do when git already tracks the file.
- 3a35c8e: `brock migrate --report <file>` writes the report relative to the current directory, not to `--root`, and prints where it wrote it.
- 3a35c8e: `brock structure` warns when a renderer file imports a workspace package's barrel that reaches a Node builtin through its re-exports, and names a subpath export to import instead. app-structure.md says a renderer imports such packages through their per-subject subpaths.
- 055bb91: `SearchEntrySeed` takes an optional `id` and `params`. `id` is the entry's key, so two entries with the same label and no anchor no longer collapse into one, and `params` are passed to `open` when the entry is picked (a Presets entry opens with its `presetId`). A hub search keeps live entries with params. A custom page's literal `searchEntries` may carry both too.
- Updated dependencies [3a35c8e]
- Updated dependencies [3a35c8e]
- Updated dependencies [e70afc3]
- Updated dependencies [e70afc3]
  - @drizztdourden08/brock-core@0.17.0
  - @drizztdourden08/brock-thread@0.17.0

## 0.16.0

### Minor Changes

- 7ef6122: `screens.config.ts` takes `settings: { bucket, page? }`: the Settings entry, the palette and Mod+Comma open that page when it is set, instead of the first settings page in nav order. `brock structure` names a `settings.page` the bucket does not hold.
- 7ef6122: `brock dev`, `build` (and so `package`), `start` and the repo command's `launch` run `brock sync` first when `.brock` is missing or older than its inputs (`brock.config.ts`, `package.json`, `src/screens`, `src/widgets`, `src/boot`, `electron/boot`), so a fresh checkout that ignores `.brock` launches. `dev` and `build` stop with a message naming the missing file when `src/main.tsx` imports a `.brock` file that does not exist, instead of starting a renderer that errors and hangs. `brock sync --if-stale` is the step `launch` runs.
- 7ef6122: A tab page takes its meta from `<page>.page.ts` beside its folder: a file that exports only `meta: ScreenMeta` (title, icon, order, shortcut, devOnly, keywords). The screen sync writes it as a `page-meta` entry, the nav and the search index name and place the page with it, and `brock structure` names a `.page.ts` with no tab folder beside it or no `meta` export.
- 55befe4: `@drizztdourden08/brock-build/testing` exports `readDockLayout(page)` and `widgetWindows(app)`. `readDockLayout` returns the widget layout from brock-react's layout store (`layout`, the `docked`, `floating` and `popped` ids, the main view's rect and each drawn widget's rect); `widgetWindows` returns every popped widget window from main with its id, bounds, visibility, focus, minimized and always-on-top state. Neither reads Tessera's class names. brock-react's `WidgetHost` installs the layout reader on automation launches only.
- 7ef6122: Breaking: brock-updater no longer exports `UpdateBadge` or its CSS; the title bar status action from `useUpdateAction` replaced it. Apps that import `UpdateBadge` switch to `useUpdateAction`; migration `update-badge-removed` turns each import into a to-do.
- 7ef6122: `WidgetMeta.order` sorts the Widgets menu, then the label, instead of the file name order. `brock structure` accepts `order` as a widget meta field.

### Patch Changes

- 55befe4: `brock adopt` points the `$schema` of a new `tessera.config.json` at Tessera's schema wherever Tessera is installed: the root `node_modules`, else `packages/design`, else any workspace package, written relative to the repo root. With no install yet it keeps the root path.
- 7ef6122: docs/app-structure.md lists which generated files are committed and which are ignored, and the Archipelia review moved out of it to docs/reviews/archipelia.md.
- 55befe4: `launchAppForTest` returns the app window, not the splash. It waits for the window that loads the renderer index (never `splash.html` or a widget window) and for the splash to close, which happens once every boot task resolved and the window was revealed. When it times out with the splash still open, the error says the boot never finished. An app no longer needs its own launcher for this.
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
- Updated dependencies [55befe4]
- Updated dependencies [7ef6122]
  - @drizztdourden08/brock-core@0.16.0
  - @drizztdourden08/brock-thread@0.16.0

## 0.15.0

### Patch Changes

- Updated dependencies [96f7759]
- Updated dependencies [96f7759]
  - @drizztdourden08/brock-core@0.15.0
  - @drizztdourden08/brock-thread@0.15.0

## 0.14.0

### Patch Changes

- @drizztdourden08/brock-core@0.14.0
- @drizztdourden08/brock-thread@0.14.0

## 0.13.0

### Minor Changes

- 33dc33c: Snap clusters replace manual window groups.

  - Every window joined by snap links, directly or through other windows, the main window included, is one cluster, computed from the live links. Dragging any window of a cluster moves the whole cluster rigidly; only the dragged window snaps, to windows outside the cluster, and what it is dropped against joins the cluster. Holding Ctrl while moving drags one window alone: it leaves the cluster, its links break (a window linked to it relinks to another window it is still flush with) and it can snap elsewhere. A window with no link moves alone as before.
  - Maximize, full screen with the black backdrop, minimize and restore act on the cluster, with the same fit and pack maths and the same restore. Closing a widget closes that widget alone. Resizing keeps the session rules and never moves a cluster.
  - Manual groups are gone: the `group` field of the popped layout, `WidgetWindowState` and the probe facts, `WidgetWindowGroup`, `widget:setGroup`, `widget:setMainGroup`, `widget:getMainGroup` and `widget:mainGroup`, the "Window group" wiring of `WidgetOptions` and `WindowTitleBar` (Brock no longer passes those props), and `config/window-group.json`, which main deletes at start. A `group` left in a saved popped entry is dropped when the layout loads, and the `drop-window-groups` upgrade step cleans the dev data under `.user-data`. `WidgetWindowSummary.group` becomes `cluster`, the number of windows in the cluster, and the probe's `group` request becomes `cluster`.
  - The window guide shows in the window being moved or resized, a widget window or the main window, instead of always in main: `widget:guide` goes to that window only. Its hints follow the new rules: snapped windows move together, Ctrl moves one window alone, flush windows resize together, Ctrl resizes one window alone without snapping.
  - A resize now moves every window on the dragged line: two widgets stacked against main's left edge both follow main's edge, and either widget's right edge moves main's edge and the other widget's; a window stacked end to end on the far side of the line follows too.
  - The review checks a cluster moving together and with main, a Ctrl move detaching, cluster maximize, restore and full screen, the guide drawn in the moved window and in main, and the stacked seam.

### Patch Changes

- Updated dependencies [33dc33c]
  - @drizztdourden08/brock-core@0.13.0
  - @drizztdourden08/brock-thread@0.13.0

## 0.12.0

### Minor Changes

- 59c1c9d: Brock moves to Tessera 0.13.0 (brock-react's peer is `^0.13.0`).

  - Palettes: `BrockApp` imports Tessera's brand palettes into the `ds.palette` layer and sets `data-palette` on the document root to `product.icons.brand`, in the main window and in popped widget windows. The starter `src/theme.css` sets no seeds and only overrides; the `brock-palette` upgrade step turns an untouched starter theme (the old blue or the Brock seeds) into that override-only file and keeps a theme the app changed. The splash, the look and the installer read the brand palette while `theme.css` sets no seeds.
  - Breaking for hero homes: `Art` takes a `kind` (`image` or `node`), `Backdrop` takes Tessera's `HeroBackdrop` (`node`, `image`, `color`) or `kind: 'none'`, and the new `Shade` slot takes `value`. The `hero-kinds` upgrade step adds `kind="image"` to art and turns a `Backdrop` with children into a to-do.
  - About has no page header, as Tessera's InfoScreen now draws none; the screen declares the new `header: 'none'` and the review checks that no header shows.
  - The search mascot comes from Tessera's `mascotForBrand`; Brock's own brand to mascot table is gone.

### Patch Changes

- Updated dependencies [f751683]
  - @drizztdourden08/brock-core@0.12.0
  - @drizztdourden08/brock-thread@0.12.0

## 0.11.0

### Minor Changes

- d3e8420: The starter app takes the Brock palette (orange, charcoal and greys, matching the Brock logo) in place of the old blue. The `brock-palette` upgrade step rewrites an app's `src/theme.css` only when it still holds the untouched old starter seeds.
- 54d913a: Widgets by convention, placed like screens: an app's widgets are `src/widgets/<id>.widget.tsx` files whose default export is the component and whose `meta` holds the label, icon, popOut, devOnly, visibility, side and sizes. `brock sync` and the dev server write `.brock/widgets.ts`, and `BrockApp` takes it as the new `widgets` prop; `defineWidget`, `registerWidgets` and module widgets keep working. `brock structure` checks the folder, the lint config lets widget files export `meta` beside their default export, the starter app has a Notes widget, and `brock adopt` gives each app of a workspace its own views and prints where every kind of code goes. The `widget-files` migration wires `src/main.tsx` and lists every hand-made widget as a to-do naming its new file. Brock's own Logs and Performance widgets follow the same layout inside brock-react, and `docs/app-structure.md` maps where every piece of an app goes.

### Patch Changes

- Updated dependencies [48ca303]
  - @drizztdourden08/brock-core@0.11.0
  - @drizztdourden08/brock-thread@0.11.0

## 0.10.0

### Minor Changes

- a265770: Every screen shows Tessera's page header with an icon and a title.

  - Breaking: `ScreenDef.icon`, `HubDef.icon` and `HubPage.icon` are required, and `ScreenLayer` takes a required `icon`. Every built-in screen has one: Profiles, Settings, About, Credits and the input tester.
  - A fullscreen screen's content sits in Tessera's `ScreenPage` inside the `ScreenLayer` card, with the screen icon and title. `header: 'own'` leaves the content to draw its own headers; hubs and the settings screen use it. Each hub page draws under its own header: settings pages in `SettingsPage` with their anchors, a settings tab that renders itself in `SettingsPage` too, and every other page in `ScreenPage`. `HubPage.fullBleed` keeps a page such as a bucket's hero home filling the pane.
  - The About screen passes the app name as the `InfoScreen` heading and an info icon.
  - The `screen-icons` migration (0.10.0) leaves a to-do on each `defineScreen` or `defineHub` call without an icon.
  - The review checks the page header, its icon and its title on every screen and every hub page that has one.

- a265770: Every settings row has a description and a hint, as in Tessera 0.10.0.

  - Breaking: a settings item is `{ key, label, hint, description | noDescription: true, keywords?, link?, control? }`, the same shape as Tessera's `SettingsItem`. The typecheck fails on an item without a `hint`, or without a `description` or an explicit `noDescription: true`. `SettingDescription` and `SettingItemFields` are exported, and a `choice` option takes its own `hint`.
  - Each item draws as a Tessera `SettingsRow`: the description under the title at rest, and the hint in its place while the control is pointed at or focused. A custom control from `renderControl` stays a content row, and a boolean item with a `link` stays a toggle with the link. `DefaultControl` is gone.
  - Search finds hints: the hub search matches the hint and each option's label and hint, the palette scores the hint like the description, and the build-time search seeds read `hint` from `.settings.ts` pages.
  - Every built-in row has a real description and hint: the template's General page, the display module's window and refresh rate rows, the updater dialog's pre-release and version rows, and the input module's dead zone sliders, which are now settings rows.
  - The `settings-row-hints` migration (0.10.0) leaves a to-do on each app settings row, in a `.settings.ts` page, a settings tab or a Tessera `SettingsSection`, that lacks a hint or a description, naming the missing fields.
  - The review points at a settings row on each settings page, checks that its hint replaces the description, and captures it.

- a265770: Brock takes Tessera 0.10.0. The catalog and the brock-react peer move to `^0.10.0`.

  - `brock migrate` replays the new `configKeys` group of Tessera's `RENAMES.json`: dotted setting paths moved inside JSON files a project keeps, by file name, where `*` stands for any one key such as an app folder. The step edits `tessera.config.json` and `package.json` at the app root, the repo root and every workspace package in place. A key whose parent stays the same is renamed where it stands, an object whose every key moves to the same new sibling is renamed whole, and any other key is cut and pasted at the indentation of its new place, with an emptied parent removed. Order, layout and indentation are kept, a second run changes nothing, and a target that is already set is never overwritten: it becomes a to-do. For Tessera 0.10.0 that moves the usage settings object to `guide`, at the top level and under each `apps` entry, and the `package.json` guide script to `guide`.
  - Brock's own `tessera.config.json` holds `guide`, and the prose exception for the old key is gone.

### Patch Changes

- @drizztdourden08/brock-core@0.10.0
- @drizztdourden08/brock-thread@0.10.0

## 0.9.0

### Patch Changes

- Updated dependencies [28540bb]
  - @drizztdourden08/brock-core@0.9.0
  - @drizztdourden08/brock-thread@0.9.0

## 0.8.1

### Patch Changes

- 03dcade: Standards moved to 0.x: Brock depends on `@drizztdourden08/standards` ^0.6.0 and calls its shared workflows at `@v0`. The family never takes a major version; `standards sync --check` now rejects a changeset that asks for one.
- Updated dependencies [03dcade]
  - @drizztdourden08/brock-thread@0.8.1
  - @drizztdourden08/brock-core@0.8.1

## 0.8.0

### Patch Changes

- 98b5318: Take standards 1.0.5, which bans tool and vendor names in prose, strings and identifiers and skips every path git ignores. Every folder that needs ignoring is a dot-folder: the repo, the app template and `brock adopt` ignore them all with `.*/`, with a `!` line per tracked dot-folder. New `brock knip` runs knip with the git-ignored paths, so it works in a worktree inside a dot-folder; the lint and deadcode scripts use it. The thread CLI finds `tools/brock-plugin-*/index.mjs` inside any top-level dot-folder instead of two named folders, and the trailer check rejects co-author lines, "generated with/by" lines and the robot emoji without naming a tool.
- Updated dependencies [98b5318]
- Updated dependencies [dcdde4a]
  - @drizztdourden08/brock-thread@0.8.0
  - @drizztdourden08/brock-core@0.8.0

## 0.7.1

### Patch Changes

- @drizztdourden08/brock-core@0.7.1
- @drizztdourden08/brock-thread@0.7.1

## 0.7.0

### Minor Changes

- f6cfba5: Brock takes Tessera 0.8.0 and its rimmed logos. `product.icons.rim` (`'light'` or `'dark'`) picks Tessera's `brand/<rim>-rim/<brand>/` set, and it defaults to `'light'` for the `brock` brand, so the mark reads on dark surfaces. `brock icons`, the splash mark, the bot variant, the installer and Setup splash mark read from that tree. `brock icons` also copies `icon-32.png` and `icon-24.png` to `public/logos/`, and with a brand `product.logos.app` defaults to `./logos/icon-32.png`, so the title bar no longer scales a 256 px icon down to 20 px and loses the rim. A copied file is skipped only when it holds the same bytes, so a rim switch recopies the set. The About panel draws a rimmed brand as its bare mark. Migration `gitignore-title-bar-logos` ignores the two new logo files.
- f6cfba5: Breaking: `RendererModule.titleBar` and `TitleBarSlot` are gone, and `STANDARD_TITLE_BAR_SLOTS` is now `STANDARD_TITLE_BAR_ACTIONS`. Tessera 0.8.0's `WindowTitleBar` takes `actions`, so a module lists `titleBarActions`: each a `WindowTitleBarAction` or a hook that returns one. Search (Ctrl+K) and Report a bug are standard actions, and the updater contributes `useUpdateAction`, a status pill reading "Update available" while an update waits. Every action is also in the hamburger, beside a View sub-menu with the pin and full screen, and an action replaces the menu entry of the same key there; Quit sits in its own group below them. The review checks the bar items, the menu actions and the View sub-menu. Migration `title-bar-actions` rewrites the updater badge and the standard buttons and leaves a to-do for any other slot.

### Patch Changes

- Updated dependencies [f6cfba5]
  - @drizztdourden08/brock-core@0.7.0
  - @drizztdourden08/brock-thread@0.7.0

## 0.6.1

### Patch Changes

- @drizztdourden08/brock-core@0.6.1
- @drizztdourden08/brock-thread@0.6.1

## 0.6.0

### Patch Changes

- @drizztdourden08/brock-core@0.6.0
- @drizztdourden08/brock-thread@0.6.0

## 0.5.0

### Patch Changes

- Updated dependencies [ff027d0]
  - @drizztdourden08/brock-core@0.5.0
  - @drizztdourden08/brock-thread@0.5.0

## 0.4.0

### Minor Changes

- f90c7ee: `brock migrate` from 0.3.0 runs `brock-compounds`: app imports of `AboutPanel` and `ReleaseNotesPanel` from `@drizztdourden08/tessera` move to `@drizztdourden08/brock-react`, `CalibrationPanel` moves to `@drizztdourden08/brock-input/renderer`, and an import of `ProfilePicker` leaves a to-do pointing to `ProfilesPanel`.

### Patch Changes

- @drizztdourden08/brock-core@0.4.0
- @drizztdourden08/brock-thread@0.4.0

## 0.3.0

### Patch Changes

- @drizztdourden08/brock-core@0.3.0
- @drizztdourden08/brock-thread@0.3.0

## 0.2.0

### Minor Changes

- ee89ad0: `brock tessera <args...>` runs Tessera's own command line (`runTessera` from `@drizztdourden08/tessera/cli`) in the current folder, so `tessera.config.json` is found from there; every word after `tessera` reaches it, `--help` too, and the repo command (`bin/<repo>.mjs tessera new compound SaveSlot`) reaches it the same way. Tessera comes from the folder's own `node_modules`, else from an app of its workspace; without it the command says how to add it and exits 1.
- becd8b0: Migrations may hold a workspace step, `workspace({ rootDir })`, for a change no single file can make; it returns `{ touched, moved, todos }`, runs after the file steps of its version, and earlier to-dos follow the files it moves. The 0.1.3 `design-package` migration uses it: a monorepo gets `packages/design` (`@<scope>/design`), a root `tessera.config.json` that points at it with one `apps` entry per app, and every app compound whose imports it can rewrite moved there and imported from `@<scope>/design`; a compound it cannot move, and a component outside the parts folders, becomes a to-do. A single-app repo gets a `tessera.config.json` with `$schema` alone.
- 1f2ce71: `brock structure` and `brock prose` run the checks of `@drizztdourden08/standards`, with Brock's extension in `brock-build/standards.extension.mjs`: `brock.config.ts` marks an app, `build/installer` and `src/screens` keep their own checks, `<id>.task.ts` is a module file. Installing `brock-build` is enough for `standards structure` to load it. Breaking: the `brock.designSystem` flag is gone; list `@drizztdourden08/standards/extensions/usage-files` in `standards.config.mjs` instead. `brock adopt` and `create-brock` take `.npmrc`, `.jscpd.json` and the knip schema from the standards templates, and the generated `eslint.config.mjs` names the `react-app` preset. `brock-thread` checks PR text with the shared writing lists from standards.
- becd8b0: Brock reads the app layout from `tessera.config.json`. The splash look, the splash token sheet and the installer take the app theme from `theme.css` of that file (with the app's `apps` entry merged in), through the app's own `@drizztdourden08/tessera/config`, and keep `src/theme.css` when there is no file or the installed Tessera has no config entry; a file that breaks the schema stops with an error naming it. `appThemeCss(rootDir)` is the new `@drizztdourden08/brock-build/theme` entry, and the managed `stylelint.config.mjs` takes its token file from it. A new app carries a root `tessera.config.json` with `$schema` alone. `brock adopt` writes one when it is missing: `$schema` alone for a single app, `package`, `parts` and one `apps` entry per app when the repo has `packages/design`.
- e19834d: `brock migrate` replays Tessera's `RENAMES.json` after the Brock migrations: each release after `--tessera-from` (new), else `package.json#brock.tessera` (new pin), else 0.3.0, up to the installed Tessera, plus `next` when Tessera is linked to main; then it pins `brock.tessera` to the installed version. `brock migrate --tessera-from <version>` alone replays only the renames. Custom properties are renamed as whole tokens, components only where a file imports them from Tessera (the import, JSX tags and references), classes in class lists and selectors with a name boundary and longer keys first, props and prop values on the Tessera component's JSX, and literals typed with a renamed Tessera type. A value that is a note, a removed export, and a longer class built from a renamed one become numbered to-dos in the migration report; an entry whose value is also a key of its release is skipped with a warning, so a second replay changes nothing. `brock upgrade` passes the Tessera version the worktree had before its install as `--tessera-from` when the app has no pin yet.

### Patch Changes

- Brock takes Tessera 0.4.0: SectionNav is SideNav and HeaderTabs is HeaderAnchorNav (replayed with Brock's own Tessera renames step), the title bar menu, the fixed-head search results and the config loader are the published ones.

  New apps' knip ignores `@drizztdourden08/standards`, whose stylelint plugins it sees through brock-lint-config; the `standards-lint-deps` upgrade step does the same for an existing app and drops `typescript-eslint` and `eslint-plugin-react-hooks`, which standards now carries.

- f818087: Breaking: Brock moves to the next Tessera. The title bar menu is Tessera's hamburger `DropdownMenu`, built from `MenuGroup[]` by `toMenuGroups` in place of `toDropdownItems`, and a bucket or page `shortcut` shows beside its entry. `product.window.titleBar.controls` turns the fullscreen, pin, minimize and maximize buttons off; maximize and fullscreen off also make the main window not maximizable or fullscreenable. About shows the Tessera brand icon and wordmark when the product is that brand, the copy buttons write through `TesseraProvider` `overrides.writeText`, Hero facts take `FactsPanelGroup[]`, and the input module's device badges are `Status`. Migrations `progress-bar-tone` and `facts-panel-names` rewrite app code; `badge-status`, `tessera-provider-overrides`, `window-title-bar-config` and `dropdown-menu-groups` leave to-dos.
- Updated dependencies [1f2ce71]
- Updated dependencies [f818087]
- Updated dependencies [e19834d]
- Updated dependencies [374cf2f]
  - @drizztdourden08/brock-thread@0.2.0
  - @drizztdourden08/brock-core@0.2.0

## 0.1.2

### Patch Changes

- 7f38965: `brock structure` accepts `Name.usage.ts` in a component folder. A package whose `package.json` has `"brock": { "designSystem": true }` must have one in every component folder outside `sub-components/`.
- Updated dependencies [25be8fe]
- Updated dependencies [f60b232]
  - @drizztdourden08/brock-core@0.1.2
  - @drizztdourden08/brock-lint-config@0.1.2
  - @drizztdourden08/brock-thread@0.1.2

## 0.1.1

### Patch Changes

- 0a52cd7: The gaps the first Archipelia app found, now in Brock. `product.ports` gives each app a port block, each thread worktree a slot of its own and the dev server `strictPort`; `create-brock` writes the base. `brock adopt` writes the knip entries and the `.gitignore` lines for generated outputs. `brock check` and `brock sync` run per app at a workspace root. `launchAppForTest` from `brock-build/testing` starts the built app headless for app e2e tests. New helpers: `confirmAction`, `useNow`, `useCopyText`, `useKeyedGuard`, `redactSecrets` and `lanAddresses()` with the `network:lanAddresses` channel.
- 568c900: An app on another Windows drive than its linked Brock checkout keeps its links: `create-brock --local`, `brock add --local`, `brock adopt --local` and `upgrade --local` add `prefer-frozen-lockfile=false` to `.npmrc` (and `pnpm-lock.yaml text eol=lf` to `.gitattributes`) when a `link:` spec crosses drives, so later installs resolve the links instead of joining `X:/...` to the app folder.
- ade72f8: Breaking: the widget host moves to the Tessera WidgetManager v2 on DockLayout. Widgets dock in a split tree around the main view (the home or game view), float over it, or open in a window of their own when their definition sets `popOut: true`, with pin, snap, towing and drag back in handled by brock-electron over the new `widget:*` channels of brock-core. The layout is `{ v: 2, dock, floating, popped, frame }` and saved layouts migrate on load; `useWidgetLayoutStore` loses `update` and gains `change`, `setLayout` and `popOut`, and `StandardOverlays` no longer takes `widgets`. Hero pages draw the Tessera Hero composite and take its slots (`Title`, `Eyebrow`, `Backdrop`, `Art`, `Actions`, `Tools`, `Facts rows`, `Aside`, `Panel`). Migrations `widget-layout-v2` and `hero-slots` turn the old uses into to-dos. The input module draws its devices and calibration with Tessera's PressedGrid, StickPlot and CalibrationPanel, the update dialog and the bug report use Tessera's Small tones, a pref changed in a popped widget reaches the app and is saved with the profile, the main view grip shows only while dragging, and the review checks the dock (no grip at rest), a headless pop-out window (focus, a pref set there kept after the dock back, closing) and the hero slots.
- 9a08468: One copy of React, zustand and Tessera per app build, so component overrides apply the same way in dev and production. The profile card no longer nests buttons, and the review tool checks fonts, the design system loading once and every settings row, and ignores a request that failed once but loaded.
- 49968cd: Breaking: the app window has no loading screen of its own; the `index-boot-splash` migration removes the hand-written boot splash from an app's `src/index.html`. The CI upgrade job now keeps the upgrade and review reports.
- c48024b: The input module carries the SDL3 addon source, fetches its prebuild on install and before `brock dev` and `brock build`, and ships it in a packaged app through module manifest fields that the builder config reads.
- 3680727: The installer preview shows the app's own version instead of a sample number.
- e406f70: `brock package` builds the small Windows installer, a downloader that reads `install.json` from the latest release and installs the payload it names, and writes that manifest with the entries carried forward from the previous release. A routine release is the update package only; `--full` adds the payload and the directory zip. The product config takes an optional `accent`, used for the installer progress bar and the downloader.
- fd0a736: The Windows installer is a template built from config. The downloader takes its colours from Tessera's dark theme (or its built-in colours until `tokens.json` exists), the gradient from the look and the mark from `public/logos/mark.svg`. Velopack's Setup splash is drawn from the same look, mark and name. `product.installer` sets the scope, the shortcuts, launch after install, an optional licence and the folder name, with rotp's behaviour as the default. `build/installer/header.png` and `build/installer/splash.png` replace the rendered images, and `brock package --render-installer` writes the screens to `release/installer-preview/`.
- be862b2: The repo launcher is a managed file: `brock sync` rewrites it from the current template, `brock check` reports it when stale, and `adopt` replaces an outdated one.
- c1c29a0: The repo command runs Brock in its own checkout when called from outside it, and a worktree install no longer rewrites the machine shims. Scaffolded and adopted apps route the scope to GitHub Packages in their .npmrc.
- bdde234: `brock add` installs the packages a module lists under `peers`, so the updater brings velopack and the display module brings koffi.
- 8498845: Platforms are separate ids (windows, macos, linux, android, web, with ios reserved) and bundles (desktop, mobile) in `targets`. Each one is a strategy with doctor checks, scaffold steps, CI and release jobs and secrets. `brock sync` composes `ci.yml` (lint, structure, tests and the headless review on Linux) and `release.yml` from them. create-brock asks for the platforms or takes `--platforms`; `platform add`, `remove` and `list`, `doctor` and `web build` are new commands. Android gets a Capacitor project in `mobile/android` with signing from the environment, `mobile build --release` and `mobile keystore`; Linux debs install module udev rules.
- f62f048: Every app gets a `--review` automation flag: a headless tour of the shell that captures a screenshot per step, checks the title bar, menu, screens, Escape, palette, bug report, About and widgets, and writes a report with exit code 0 or 1. Escape now closes the title bar menu, palette results draw their icons, About rows keep a gap, and `brock start` launches the app folder so the app version applies.
- 068a02d: Screens by convention: files in src/screens become bucket hubs, pages, tabs, settings pages, cards and custom screens through a generated .brock/screens.ts, with the menu, bucket switch, Escape home and settings placement read from screens.config.ts. brock structure checks the layout, the review opens every generated screen, and the template app uses it.
- b1fa12d: Breaking: a full-bleed screen at the root of src/screens is now `<id>.layer.tsx`, and `<page>.custom.tsx` names a custom page inside a bucket; migration custom-layer-rename renames each root `.custom.tsx` and lists it in the report, and knip-custom-pages adds custom pages to the knip entries. Search now reads one index for the palette and every hub: `brock sync` and the dev server write `.brock/search.ts` from the screens, their `meta.keywords`, the settings rows and each custom page's `searchEntries`, without loading any page, and modules, widgets, the menu, actions and `useSearchEntries` join at runtime. Generated hubs have search on, grouped by page, Ctrl+K inside a hub focuses it, a result opens its page and flashes its row, `brock structure` fails a custom page without `searchEntries` and counts them per bucket, and the review searches a sample from each source in the palette and in a hub.
- ae6b8e2: The shell matches the reference app out of the box: logos, window icon, splashes and the home screen come from the product config, screens and hubs share one framed card, Escape opens home, and the menu has sections, icons, a Dev Console and Credits.
- 14c3674: The splash window is now the only loading screen. It has no frame, border, radius or shadow, a gradient from `product.look` (else the Tessera brand gradient, else the palette seeds through `resolveLook`), the brand mark without its tile, the app name, a status line, a bottom progress bar and the version. The app window stays hidden at its restored bounds until every boot task is done and the home screen has painted, then the two crossfade over 220 ms. Boot tasks are standard: `defineBootTask` in `src/boot/<id>.task.ts` and `electron/boot/<id>.task.ts`, listed by `brock sync` in `.brock/boot.*.ts`, plus module `bootTasks`, run in order with timeouts and weighted progress. A failed task or the watchdog shows the error on the splash with Retry, Open logs and Quit. The boot splash inside `index.html`, `BootProgressBar`, `bootProgress` and `window:shellReady` are gone. `--screenshot-splash=<name>` captures the splash, and the review checks that the splash closed, the app stayed hidden during boot and no loading overlay is left in the app.
- 2cc7040: The splash picks light or dark text by contrast against its gradient, from Tessera's theme text and background colours when they are available.
- a8a87be: Apps update and ship the way Relic of the Past does. The update dialog no longer opens by itself: a found update shows as a badge on a version tag in the title bar, which modules reach through the new `RendererModule.titleBar` slot. `brock package` builds the app tree, the Windows installer with the app icon and a splash, and the Velopack update packages. `create-brock` and `brock adopt` write a release workflow that packages every platform and publishes to GitHub Releases with `release-notes/v<version>.md` as the body, and `brock release` dispatches it.
- e2cf0ee: Every new app starts with the updater: create-brock records it and adds the module and its velopack peer in registry and local link mode. The title bar drops the permanent version tag and shows an "Update available" badge only when an update is found, the update dialog follows the reference layout and says plainly when the app has no update source, and the review tool checks the menu entry, the dialog and its Escape.
- 97496b7: Apps pin Brock once in `package.json#brock.version`, and sync, adopt and create-brock keep every Brock dependency on it. `brock migrate` runs the migrations Brock packages ship, and `<app> upgrade [version] [--check] [--no-review]` moves an app to a release in its own worktree, proves it with the gate and the headless review, and commits when green. Breaking: BrockApp no longer takes logoSrc or instanceLogoSrc (migration brock-app-logo-src), a non-boolean setting row needs a control (migration base-setting-controls), the built-in About menu entry replaces an app's own (migration menu-built-in-about), and .gitignore gains the files newer Brock generates (migration gitignore-generated-files).
- Updated dependencies [0a52cd7]
- Updated dependencies [568c900]
- Updated dependencies [ade72f8]
- Updated dependencies [f6a334e]
- Updated dependencies [c48024b]
- Updated dependencies [e406f70]
- Updated dependencies [fd0a736]
- Updated dependencies [8dec315]
- Updated dependencies [8498845]
- Updated dependencies [d78f430]
- Updated dependencies [f62f048]
- Updated dependencies [068a02d]
- Updated dependencies [b1fa12d]
- Updated dependencies [ae6b8e2]
- Updated dependencies [14c3674]
- Updated dependencies [2cc7040]
- Updated dependencies [a8a87be]
- Updated dependencies [97496b7]
  - @drizztdourden08/brock-core@0.1.1
  - @drizztdourden08/brock-thread@0.1.1
  - @drizztdourden08/brock-lint-config@0.1.1
