<!-- @layer docs @kind doc -->
# Code structure

One structure for every repo of the family: Tessera, Brock, Archipelia, Relic of the Past. A file has one obvious home and a boundary cannot be crossed by accident. The rules are enforced by pnpm, `brock-lint-config` and `brock structure`, not by memory.

## Top level

```
<repo>/
  pnpm-workspace.yaml     packages, catalog of shared versions, overrides
  package.json            root scripts only: lint, lint:md, structure, test, build; no source
  apps/<app>/             deployables: desktop, mobile, web, site
  packages/<subject>/     one package per bounded context, named after the subject
  tooling/<tool>/         repo scripts, one package each
  docs/                   contributor docs only
  core/                   non-TS code when the repo has any
```

## A package

```
packages/<subject>/
  package.json            name "<scope>/<subject>", exports { ".": "./src/index.ts" } and at most a few subpaths
  src/index.ts            the only public surface
  src/<feature>/<Name>/   Name.tsx, Name.css, Name.type.ts, behavior/, sub-components/, index.ts
  tests/                  the package's own tests
```

A package is one subject. A second subject is a second package. A package with fewer than five files merges into its neighbour.

## A file holds one thing

Every implementation file holds exactly one thing, and its companions sit beside it under its own name. `brock structure` checks the folders; six eslint rules check the files on every write.

```
shell/TitleBar/                       a component folder: recognised by TitleBar/TitleBar.tsx
├── TitleBar.tsx                      one component, imports only ./TitleBar.css
├── TitleBar.css
├── TitleBar.type.ts                  every type and interface of the component
├── TitleBar.constants.ts             every UPPER_SNAKE constant
├── behavior/
│   ├── useTitleBar.ts                one hook, named after the file
│   └── title-bar-class.ts            one pure function, kebab-case
├── sub-components/
│   ├── PinButton.tsx                 flat: one component with no companion
│   └── WindowControls/               grew a companion: same shape one level down
└── index.ts                          export { TitleBar } from './TitleBar'

settings/features/                    a module folder: no .tsx of its own name
├── resolver.ts                       export { createFeatureResolver }
├── setting-lock.ts                   export { createSettingLock }
├── feature.type.ts
├── feature.constants.ts
└── index.ts
```

| Rule | Enforced by |
|---|---|
| One component per `.tsx`; the second one is `sub-components/<Name>.tsx` | `local/one-component-per-file` |
| One exported value per implementation file; `index.ts`, `*.type.ts` and `*.constants.ts` are the lists | `local/one-export-per-file` |
| `type` and `interface` live in `*.type.ts` (`augment.ts` and `*.d.ts` too) | `local/types-in-type-file` |
| `UPPER_SNAKE` constants live in `*.constants.ts` | `local/constants-in-constants-file` |
| A `useX` hook lives alone in `useX.ts` | `local/hook-file-named-after-hook` |
| A component imports only `./<Name>.css`; theme and token sheets are imported by the entry | `local/css-beside-component` |
| A component folder holds `Name.tsx`, `index.ts` and, optionally, `Name.css`, `Name.type.ts`, `Name.constants.ts`, `Name.usage.ts`, `behavior/`, `sub-components/`; a flat component is `Name.tsx`; a module folder holds kebab-case `.ts` files, `useX.ts`, `<subject>.type.ts`, `<subject>.constants.ts`, `index.ts` | `brock structure` |
| Stories, tests and config files are exempt from the shape rules; a file that is a list by nature goes under `shapeOff: [{ files, why }]` | `brockEslint` |

## Where raw values live

Three tiers of stylesheet, declared in `stylelint.config.mjs`:

| Tier | Option | May hold |
|---|---|---|
| Raw values | `rawValueGlobs` (the palette, the brand colours, the size scale, font faces) | hex colours, `px` and `rem` lengths |
| Tokens | `tokenGlobs` (`theme.css`, `tokens/**`) | custom properties whose values derive from the raw tier through `var()`, `color-mix()`, `calc()`; `em` only for `--tracking-*` |
| Components | `uiGlobs` (everything else) | `var(--token)` only; a component may alias a token into its own custom property |

Shared component sheets (a field layout used by several composites) live in `theme/` or `tokens/` and are imported once by the package entry; a component imports only its own sheet. A repo without a raw tier leaves `rawValueGlobs` out and its token files stay exempt as a whole.

## A token override says why

A stylesheet that is not a token file and sets a custom property whose name is a Tessera or app token gets a warning from `brock/no-token-override`; a new property that repeats a token's value gets one from `brock/no-token-shadow`. The token names come from the repo's `tokenGlobs` and from `@drizztdourden08/tessera/tokens.css`, following its `@import` chain, so nothing drifts from the CSS. A warning does not fail the gate. An override that is right stays, with its reason in the one comment form the CSS gate accepts:

```css
/* stylelint-disable-next-line brock/no-token-override -- dense table rows, agreed with design */
.table--dense { --space-sm: var(--space-xs); }
```

A disable without a reason fails (`reportDescriptionlessDisables`).

## Rules

| Rule | Enforced by |
|---|---|
| Import another package by its alias, `@scope/subject`, through its barrel | `local/no-cross-package-relative`, `local/no-deep-package-import`, pnpm strict `node_modules` |
| Every package is named `<scope>/<subject>` and has `exports["."]` pointing at a real file | `brock structure` |
| No folder named `lib`, `utils`, `helpers`, `misc` or `common`; name the subject | `local/no-generic-folder-names`, `brock structure` |
| Nothing deeper than five levels below `src` | `brock structure` |
| In a package whose `package.json` has `"brock": { "designSystem": true }`, every component folder outside `sub-components/` holds `Name.usage.ts`, the note on when to use the component | `brock structure` |
| No comments, in TS, JS and CSS alike. A comment passes only when it has a working form: the first-line header tag, a tool directive on the allow list (`DEFAULT_COMMENT_ALLOW`, extended per repo through `comments.allow`), and a JSDoc type block in plain JavaScript, which has no other type syntax | `local/no-comments`, stylelint `comment-pattern` |
| A JSDoc type block is types, not prose: every line starts with a type tag (`@param`, `@returns`, `@typedef`, `@property`, `@type`, `@template`, `@callback`, `@import`), at most 10 lines, the note after a tag at most 60 characters and never a sentence. No description line. A `.ts` file carries no JSDoc at all | `local/no-comments` |
| No raw HTML outside the design-system primitives. Every screen is built from Tessera components (`Box`, `Text`, `Flex`, `Button`, ...), and a missing piece becomes a new primitive in Tessera, not a `<div>` in the app | `local/no-raw-html`, off only under `primitivesGlobs` |
| No `style` prop outside the primitives. A justified exception is listed in `eslint.config.mjs` as `inlineStyle: [{ files, why }]`; the factory refuses an entry without a `why` | `local/no-inline-style` |
| Tokens only in CSS: no hex, named, `rgb()` or `hsl()` colour, no `px`, `rem` or `em` outside a media query, no numeric `font-weight` or `z-index`, no `font-family` but a token, and a custom property set only to another token. Raw values live in the token files (`tokenGlobs`); a documented exception goes under `exemptGlobs` | `brock-lint-config/stylelint` |
| 200 lines per file, one thing per file, arrow functions, exports grouped at the end, `import type`, raw form controls only in primitives | `brock-lint-config` |
| Small units: cyclomatic complexity 10, 60 lines per function, 4 parameters, nesting depth 3, 3 nested callbacks. A function over the line is split at a real seam, never in half | `complexity`, `max-lines-per-function`, `max-params`, `max-depth`, `max-nested-callbacks` |
| No generated-code shapes: no `console` outside a CLI (`consoleGlobs`), no empty block or silent `catch {}`, no nested ternary, no `as any`, no `as unknown as T` outside a listed boundary (`doubleCast: [{ files, why }]`), no default export outside stories and module entries, no `React.FC`, no enum, no class component, no `@ts-ignore` (`@ts-expect-error` with a reason) | `quality-rules.mjs`, `@eslint/js` recommended, typescript-eslint recommended and stylistic |
| Typed checks on every `.ts` and `.tsx` (the project service reads the nearest tsconfig, so tests and stories must be in an `include`): no floating or misused promise, no `await` on a non-promise, no `async` without `await`, no condition the types already decide, no unnecessary assertion, `??` and `?.` where they apply, exhaustive `switch`, no `any` leaking through arguments, assignments, calls, member access or returns, no deprecated API. `typed: false` in the config turns the layer off for a repo that cannot carry it yet | `TYPED_RULES` in `quality-rules.mjs` |
| No dead code: every export is imported somewhere, every file is reachable from an entry, every dependency is used and every used package is declared. Entries per workspace live in `knip.json` | `knip` (`pnpm deadcode`) |
| No duplicated code: no two blocks of 5 lines or 50 tokens alike across TS, JS and CSS | `jscpd` (`pnpm duplicates`), `.jscpd.json` |
| Exports are the last statements of a file; nothing follows the export block | `local/exports-last` |
| No generated names: no `Helper`, `Util`, `Wrapper`, `Impl`, `Temp`, `V2` suffix, no `Enhanced`, `Improved`, `New`, `Simple`, `My` prefix, no `foo`, `tmp`, `dummy`, no numbered copies. A name says what the thing is for | `local/no-slop-identifiers` |
| No generated prose anywhere: dashes, smart quotes, emoji and glyphs, hedges (`you may want to`, `for now`, `should work`), stock phrases, connectors, filler adverbs, placeholders (`in a real app`, `implementation goes here`), exclamation marks. Applies to comments, strings, JSX text, Markdown, and through `brock prose` to every other tracked text file (json, yaml, toml, html, svg, txt, config files) | `local/no-em-dash`, `local/no-smart-punctuation`, `local/no-slop-prose`, `BROCK001-006`, `brock prose` |
| Markdown has no template shape: no `Overview`, `Summary`, `Key features` or `Conclusion` heading, no `- **Label:** text` bullet runs, no emoji headings | `BROCK004`, `BROCK005`, `BROCK006` |
| Dependency direction is one way: apps depend on packages, packages on lower packages, nothing on an app | the package.json graph |
| Tests live in the package they test; e2e in `apps/<app>/tests`; `*.keep.test.ts` marks a kept test | vitest workspace |

## Exceptions are written down, never silent

Every gate has one place for a justified exception, and that place is the repo's config file, where a review sees it:

```js
export default brockEslint({
  primitivesGlobs: ['packages/ui/src/primitives/**/*.tsx'],
  inlineStyle: [{ files: ['packages/ui/src/composites/Slider/**'], why: 'thumb position is a live value' }],
  comments: { allow: ['^\\s*\\*?\\s*@generated\\b'] },
  rawColorOffGlobs: ['packages/palette/**'],
});
```

Two more forms, both with a `why`: `glyphContent: [{ files, why }]` in `eslint.config.mjs` for a file whose data is emoji or glyphs (an emoji icon primitive and its stories), and `.proseignore` at the repo root for a verbatim third-party text file that `brock prose` must not read, one entry per line as `<glob>  <why>`:

```
src/fonts/LICENSE.txt   the font's licence, CC BY 3.0, travels unchanged
src/fonts/README.txt    the font author's notes, travel unchanged
```

An `eslint-disable` line in a source file is the wrong place: it hides the exception where nobody looks for it. When a rule is wrong for a whole class of files, the fix is in `brock-lint-config`, reported to the Brock thread, not a disable in the consumer.

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
