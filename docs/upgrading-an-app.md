<!-- @layer docs @kind doc -->
# Upgrading an app to the current Brock

This guide is for the thread that owns an app built on Brock (Archipelia today, RotP later). It covers how to move the app to the current releases, which rules the gate now enforces, and how to report what you find.

## Versions

Every package of the family stays below 1.0. A breaking change bumps minor, a fix bumps patch, and no changeset says `major`: `standards sync --check` rejects one that does.

| Package | Range to use |
|---|---|
| `@drizztdourden08/brock-*` | the latest published minor, e.g. `^0.9.0` |
| `@drizztdourden08/tessera` | brock-react's peer range; `upgrade` moves the app there for you |
| `@drizztdourden08/standards` | comes through `brock-lint-config`; list it only if the repo calls `standards` directly |

Use published ranges, not `link:` paths into a local checkout. A `link:` spec ties the app to whatever state that checkout is in, and the upgrade path, the CI and the review all assume published versions. Link only while you are co-developing a change in Brock or Tessera, and go back to ranges once it ships.

## The upgrade, step by step

1. Commit or finish open work first. `upgrade` runs in its own worktree from the current `main`.
2. `<app> upgrade --check` says how far behind the app is.
3. `<app> upgrade` creates the worktree, bumps the Brock packages, moves Tessera to the range Brock asks for, runs `pnpm install`, runs every Brock migration after the app's `brock.version`, replays Tessera's `RENAMES.json` after the app's `brock.tessera`, then runs the gate (lint, typecheck, structure, test) and the review. In a monorepo the app is the workspace package that holds `brock.config.ts` (`apps/desktop`): sync and the migrations run there, from that package's own pins, and every other workspace package that names Brock moves with it. The gate runs the root scripts, then each app's own; it skips an app's script when the root script of the same name already runs it in every package (`pnpm -r <script>` with no `--filter`), so a monorepo lint does not run twice.
4. Read `.brock/upgrade-report.md` in each app of the worktree (`apps/desktop/.brock/upgrade-report.md` in a monorepo); `upgrade` prints every path. Every to-do names a file, a line and what to change. Mechanical renames are already done; the to-dos are the changes that need a person.
5. When the gate is green and the review passes, merge the worktree branch.

`brock migrate --from <version> [--tessera-from <version>]` runs the same migrations by hand, for example after a partial upgrade. It needs the app's `brock.version`; an app without one was never on Brock (see Adopting an app that was never on Brock).

The `RENAMES.json` replay also moves imports between Tessera entry points. Each release lists in `moves` the parts that changed entry point, under the name they have after that release's renames, so `PathField` from `/primitives` becomes `PathInput` from `/composites` in one replay. An import or `export { … } from` re-export of a moved name through the old subpath (`/primitives`, `/composites`, `/brand`, `/data` and the others) takes it from the new one: a mixed list splits, the moved names join an import of the same kind already on the new entry, and a default import stays where it is. An import from `@drizztdourden08/tessera` itself never moves, so an app that imports from the root has nothing to change.

Brock 0.19 and 0.23 shipped the 0.17 and 0.20 moves as the migrations `tessera-part-moves` and `tessera-tier-moves`, before `RENAMES.json` recorded them. Those migrations still run for an app that comes from before them, and the replay then finds those imports already moved. Running both, in either order and as often as you like, leaves the same imports with no name imported twice.

## Adopting an app that was never on Brock

An app built before Brock, such as Relic of the Past, has no `brock.version` in its `package.json`. No Brock migration applies to it: the migrations from 0.1.1 on rewrite code that Brock itself once generated, and an app that never had that code would only collect noise from them.

### First adoption

1. Run `brock adopt` at the repo root. It pins `package.json#brock.version` to the Brock version that adopts it (the current release), unless a pin is already there, and prints the pin. `brock sync` pins each app folder the same way the first time it runs there.
2. From then on, `brock migrate` and `<app> upgrade` start after that version. The first upgrade to a later Brock runs only the migrations of the releases in between.
3. `brock migrate` refuses an app with no `brock.version` (in its own `package.json` or its workspace root's), with or without `--from`, and points to `brock adopt`. `--tessera-from` alone still runs, since it replays only Tessera's renames.

Never pass an old `--from` to bring a non-Brock app "up to date": the app starts at the version it adopts.

### An app with its own copy of the design system

Tessera began as a copy of Relic of the Past's design system (RotP master `b2a089bd1`), and RotP still imports that copy from `apps/web/src/ui/design-system`, through the `@ds` alias and relative paths. Tessera's `RENAMES.json`, from its first release with entries (0.4.0), is the conversion path from that copy, and `brock migrate` runs it:

```
pnpm add @drizztdourden08/tessera            # in the package that holds the code
brock migrate --tessera-from-copy apps/web/src/ui/design-system --alias @ds --report copy-report.json
```

1. The copy folder is relative to `--root` (the current directory by default). `--alias` names an import alias that stands for it, and can be given more than once. Every script and stylesheet under `--root` outside the copy is covered, so run it where all the importing code sits (RotP: the repo root, which reaches `apps/web`, `apps/sanctuary` and `tests`). It needs Tessera installed and does not need `brock.version`.
2. Each named import or `export { … } from` of the copy takes the Tessera entry for its tier: `primitives/…` from `@drizztdourden08/tessera/primitives`, `composites/…` from `/composites` (the field kits and the colour pickers from their own entries), `data/…` from `/data`, and `tokens/index.css` becomes `@drizztdourden08/tessera/tokens.css`. Imports from the same entry join into one.
3. Every release of `RENAMES.json` from 0.4.0 to the installed Tessera then replays over the converted files, oldest first, with the moves. The first run replays over every other script and stylesheet in scope too (the custom properties and classes they name), except a script that already imported Tessera; `brock.tessera` is pinned after it. A second run converts only what is left and changes nothing it already changed.
4. Two copy parts share a name with a different Tessera part. The copy's `Badge` (a status word) becomes `Status`, with `variant` as `tone`, and its `Stepper` (a number with plus and minus) becomes `NumberInput` with `buttons="sides"` and `ariaLabel` as `aria-label`. Neither ever becomes Tessera's own `Badge` (a count or a dot) or `Stepper` (the wizard steps): the replay renames them at 0.4.0 and 0.6.0, before Tessera reused the names. Afterwards a converted file that still imports a copy name Tessera now uses for another part, and that no later rename gave back (`Badge`), is a to-do.
5. Each converted import is then checked against the installed Tessera: a name another entry exports moves there, and a name no entry exports (a helper from inside the copy, such as `useAnchorMenu`) is a to-do.
6. What cannot be rewritten safely is a to-do in the report: a namespace or default import of the copy, a string that names a copy path (a dynamic import, a `vi.mock`), a stylesheet `@import` of the copy, a file that imports both the copy and Tessera, every rename note of `RENAMES.json` (Tessera's `MIGRATION.md` explains each), each config line that maps the alias (`tsconfig.json` paths, the Vite aliases), and the copy folder itself, to delete once nothing imports it.

Tests of the copy's own internals (RotP's `tests/design-system`) come out as to-dos; they test code Tessera now owns, so they go with the copy.

### Main and renderer in two folders

A Brock app keeps its main process in `electron/` and its renderer in `src/`, side by side in the folder that holds `brock.config.ts`. There is no setting that points either one elsewhere: `brock sync` scans `electron/boot`, `electron/handlers`, `src/screens`, `src/widgets` and the other convention folders beside `brock.config.ts`, and the managed Vite, TypeScript, ESLint and knip configs, `brock structure`, the stale checks and the review all read the same two folders. An app that splits them moves them together once.

RotP keeps its main process in `apps/desktop/electron` and its renderer in `apps/web/src`; its root `electron.vite.config.ts` already builds the two as one app. The Brock app folder is `apps/desktop`, where `electron/` already is:

1. Before the move, take every import alias other than `@app` out of the code, since Brock's managed configs resolve only `@app` (the app's `src`, for main and renderer alike, as RotP's `@app` is today):
   - `@domains/<path>` becomes `@app/ui/domains/<path>`, a plain text replacement.
   - `@ds/<path>` goes with the conversion of the copy (above).
   - `@shared/<path>` becomes an import of a workspace package (`packages/shared` named `@rotp/shared`), the one-package-per-PR step of the programme.
2. Move the renderer: `git mv apps/web/src apps/desktop/src`. Merge `apps/web/public` into `apps/desktop/public` (RotP has `public/wasm` in both, so compare before you overwrite), leaving out the `public/logos` files `brock icons` now writes.
3. Search the repo for `apps/web/src` and `apps/web/public` and fix each hit: relative imports that crossed the two folders (`apps/desktop/electron/window/window-icon.ts` reads from `apps/web`), the tests under `tests/` that import renderer files by path, the root `tsconfig.json` paths, `vitest.config.ts`, and the root `build:web` script.
4. Add the Brock skeleton. `create-brock` will not write into a folder that is not empty, so create it beside the app and copy across what `apps/desktop` lacks:

   ```
   npx create-brock apps/brock-skeleton --name "Relic of the Past" --id relic-of-the-past --app-id com.relicofthepast.app --tessera registry --platforms desktop,android,web --yes
   ```

   - Copy `brock.config.ts` (set `ports: { base: 1991 }`), `src/screens/screens.config.ts` and the other files `apps/desktop` does not have.
   - Merge the two `package.json` files: keep RotP's name and dependencies, take the skeleton's scripts and Brock dependencies.
   - Where both have a file (`electron/main.ts`, `electron/preload.ts`, `src/main.tsx`, `src/index.html`), keep the skeleton's, since Brock owns the boot, the preload bridge and the splash, and port what RotP's own file did into `electron/<subject>/`, `electron/handlers/<subject>-handlers.ts`, `src/boot/` and the screens.
   - Delete `apps/brock-skeleton`, then run `brock sync` in `apps/desktop`: it writes the managed configs and `.brock/`.
5. Delete what is left of `apps/web` (its `vite.config.ts`) and the root `electron.vite.config.ts`. The web build now comes from `apps/desktop` through the `web` platform (`vite.web.config.ts`, `brock web build`).
6. Run `<app> structure --check` and `pnpm lint`; both list what still sits in the wrong place.

### Android

A Brock app keeps its Android project in `mobile/android` inside the app folder, with a managed `capacitor.config.json` at the app root: `brock sync` writes it from `brock.config.ts` (`appId` from `product.appId`, `appName` from `product.name`, `webDir: dist/web`, `android.path: mobile/android`, `allowMixedContent: false`). Brock reads no `capacitor.config.ts`: the Capacitor CLI loads a `.ts` or `.js` config before the JSON, so one left at the app root would silently replace the managed file, and `<app> platform add android` fails on it until it is gone.

RotP has `apps/mobile` with `capacitor.config.ts`, `android/`, `assets/` and its own `package.json`. Move it into the app folder after the main and renderer move:

1. `git mv apps/mobile/android apps/desktop/mobile/android`.
2. Delete `apps/mobile/capacitor.config.ts`. Everything it sets is in the managed file: `com.relicofthepast.app` is `product.appId`, "Relic of the Past" is `product.name`, and `webDir` becomes the app's own `dist/web` instead of `../../dist/web`. A Capacitor setting the managed file does not write is a Brock request, not a second config.
3. Move the Capacitor plugins from `apps/mobile/package.json` into `apps/desktop/package.json` (`@capacitor/app`, `@capacitor/filesystem`, `@capacitor/haptics`, `@capacitor-community/keep-awake`, `@capawesome/capacitor-file-picker`): `cap` runs from the app's `package.json` and finds the plugins there. `platform add android` adds `@capacitor/core`, `@capacitor/android`, `@capacitor/cli` and `@capacitor/assets`.
4. Fix `mobile/android/app/build.gradle`, which is one folder deeper now:
   - The version block reads `../../../../package.json`, the repo root. Point it at `../../../package.json`, the app's own `package.json`, which is the version Brock releases. Brock's `versionCode` patch sees `appVersionCode` and leaves the block alone.
   - The paths into the app lose `desktop/` (`../../../desktop/electron/input/...` becomes `../../../electron/input/...`), and the paths to the repo root gain one `../` (`third_party`).
   - Rename the signing variables `RELIC_KEYSTORE_FILE`, `RELIC_KEYSTORE_PASSWORD`, `RELIC_KEY_ALIAS` and `RELIC_KEY_PASSWORD` to their `BROCK_` names, and let the key password fall back to the store password, since Brock's release job sets only `BROCK_KEYSTORE_FILE`, `BROCK_KEYSTORE_PASSWORD` and `BROCK_KEY_ALIAS` (from the `ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD` and `ANDROID_KEY_ALIAS` secrets). Brock's signing patch then sees `BROCK_KEYSTORE_FILE` and leaves RotP's block alone. Left as it is, the patch cannot apply, because RotP's `buildTypes` opens with `debug`, and it fails with a message.
5. Run `<app> platform add android` in `apps/desktop`. It writes `capacitor.config.json` and the ignore lines, skips `cap add android` because `mobile/android` exists, and runs the Gradle patches. Then `npx cap sync android` rewrites `capacitor.settings.gradle` and `capacitor.build.gradle` for the plugins' new place.
6. `apps/mobile/assets` gives way to `mobile/assets`, which `brock icons` and `@capacitor/assets` draw from the Tessera brand set and git ignores. Compare the two before you delete the old one.
7. Delete `apps/mobile` and the root scripts `assets:android`, `cap:sync`, `android:open` and `android:run`. `<app> mobile push` installs a debug build on a device and `<app> mobile build [--release]` builds the APK.

## What the gate enforces

### Files and code

- Every file starts with the `@layer … @kind …` header.
- No comments in code, apart from the header and directives. Name things so the code reads on its own; notes go in a doc page.
- One exported value per implementation file. Types live in `*.type.ts`, `UPPER_SNAKE` constants in `*.constants.ts`, lists in `index.ts`.
- No placeholder or qualifier names (`temp`, `data2`, `EnhancedX`, `xHelper`, `xUtils`).
- Component folders hold `Name.tsx`, `index.ts` and optionally `Name.css`, `Name.type.ts`, `Name.constants.ts`, `Name.usage.ts`, `behavior/` and `sub-components/`.

### Wording

The prose checks run on comments, strings, Markdown, other text files and pull requests. They report stock phrasing, filler adverbs, slop vocabulary, em and en dashes, curly quotes, emoji, and tool brand words (the names of assistant products and the generic terms for them). Rewrite the sentence; do not swap the character. A project allows a legitimate word with `prose.allow`.

### Ignored files

`.gitignore` ignores every dot-folder with `.*/`, keeps a short note at the top that explains the convention, and lists exceptions only for tracked dot-folders (`.github/`, `.changeset/`, `.vscode/extensions.json`). Never name a tool's folder. Every check skips what git ignores. Run knip through `brock knip`, which stays correct inside worktrees.

### Tessera parts

- `tessera.config.json` sits at the repo root. In a monorepo the shared design-system parts live in a workspace package, `packages/design` (`@<scope>/design`), and each app keeps its own views under `apps.<path>.parts.views`.
- `guide.usage` is `report` or `enforce`. In `enforce`, every component folder inside `parts` needs a `Name.usage.ts`.
- `brock tessera new compound <Name>` scaffolds a part where the config says, and `brock tessera check` runs the usage checks.

## Conventions an app now follows

- **Screens:** `src/screens/screens.config.ts` declares the buckets; files are picked up by name (`.hero.tsx`, `.page.tsx`, `<page>/<tab>.tab.tsx`, `.settings.ts`, `.custom.tsx`, `.card.tsx`, `.layer.tsx`). Every screen has an icon and a title.
- **Settings rows:** each row has a `description`, or `noDescription: true` when there is nothing to say, and always a `hint`, shown on hover of the control.
- **Title bar:** buttons are actions. Search, Report a bug and Check for updates are standard; a module adds its own through `titleBarActions`. `product.window.titleBar.controls` turns window buttons off.
- **Brand:** `product.icons.brand` picks the Tessera brand and `product.icons.rim` (`light` or `dark`) the rimmed logo set; `brock icons` copies them.
- **Widgets:** declare them with `defineWidget`. Popping out, syncing with the main window, groups, snapping and resizing are Brock's; never add window code of your own.
- **Built-in compounds:** `AboutPanel`, `ReleaseNotesPanel` and `ProfilesPanel` come from brock-react, `CalibrationPanel` from `brock-input/renderer`. Use them; do not copy them.
- **Boot and splash:** boot tasks are `src/boot/*.task.ts` and `electron/boot/*.task.ts`; the splash and the installer come from `brock.config.ts`.
- **Review:** `<app> launch main none --review` must pass, and so must the packaged run after `pnpm build` (`--prod --review`).

## Reporting

Report while you work, not at the end. Every report says what happened, where (file and line, in the app and in the Brock or Tessera package), how to reproduce it, and what you expected.

| Kind | Send it to |
|---|---|
| A Brock bug, a missing Brock feature, an unclear migration or to-do | the Brock thread: `coord inbox send brock "<text>"` |
| A Tessera bug, a missing prop or part, a wrong rename | the Tessera thread: `coord inbox send foundations "<text>"` |
| Something the app built that other apps would need | the thread that should own it, marked "should be shared" |
| An improvement to an existing feature, or a flaw found while using it | the owning thread, marked "enhancement" |

Do not patch Brock or Tessera code inside the app, and do not fork their components. When you need a workaround to keep going, keep it small, leave a to-do that names the report, and remove it when the fix ships.
