<!-- @layer docs @kind doc -->
# create-brock

The scaffolder. It copies the blank app, writes the identity into it, asks which
platforms it ships to, wires the dependencies, writes the pnpm files, runs the first
`brock sync` (which writes the CI and release workflows) and the platform steps.

```
pnpm create @drizztdourden08/brock my-app
pnpm dlx create-brock my-app [options]
```

## First time on a machine

The packages live on GitHub Packages, which needs a sign-in even for public packages.
Point the scope there and give npm a token with `read:packages`, once:

```
npm config set @drizztdourden08:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken <token>
```

The scaffolded app's `.npmrc` carries the scope line, so installs inside it need only the token.

## Options

```
--name <text>          display name (default: from the folder name)
--id <slug>            package id (default: the folder name as a slug)
--app-id <reverse-dns> Windows AppUserModelId and electron-builder appId (default: com.example.<id>)
--author-name <text>   (default: git config user.name)
--author-email <text>  (default: git config user.email)
--modules a,b          Brock module ids to install and record, beside the template's own
--platforms a,b        platform ids and bundles for targets (default desktop)
--local <path>         Brock checkout; every @drizztdourden08/* dependency becomes a link: spec
--tessera <path>       Tessera checkout (default: <local>/../tessera when present, else the registry)
--yes                  accept the defaults, ask nothing
--install              run pnpm install after scaffolding
```

Without `--yes`, each identity field no flag supplied is asked for on the terminal,
with the default shown. The target folder must be empty or absent.

## Platforms

Without `--platforms` and without `--yes`, the terminal lists the bundles and the platforms
by number and takes numbers or ids, comma separated; Enter keeps `desktop`:

```
Which platforms does the app ship to? Numbers or ids, comma separated.
   1  desktop  Windows, macOS and Linux (bundle)
   2  mobile   Android today, iOS once it is supported (bundle)
   3  windows  Windows
   4  macos    macOS
   5  linux    Linux
   6  android  Android
   7  ios      iOS, not supported yet
   8  web      Web
Platforms (desktop):
```

The answer goes into `targets` in `brock.config.ts` as typed, bundles included, so
`mobile` gains iOS later with no config change. Choosing `ios` says it is not supported
yet and asks again; `--platforms ios` fails the same way. An unknown word lists the ids.

Each chosen platform then runs its scaffold steps in two passes. Before the install, the
steps that only edit files: the Capacitor packages in `package.json` for Android (plus
`sharp` in `onlyBuiltDependencies` for `@capacitor/assets`, and `mobile/` lines in
`.gitignore`, `.proseignore` and `.jscpd.json`), the `build:web` and `dev:web` scripts
for the web. After `--install`, the steps that need the tools: the Tessera brand icons,
the web build and `cap add android` into `mobile/android`, the launcher icons and splash
from the brand set with `@capacitor/assets`, and the Gradle patches (signing from the
`BROCK_KEYSTORE_*` variables, `versionCode` and `versionName` from `package.json`).
Without `--install` those wait, and the closing lines say to run
`<app> platform add <targets>` after `pnpm install`. Every step skips what is done, so
running it again is safe.

Then it prints the doctor report for the chosen platforms (what this machine has and the
install command for what it lacks; it installs nothing) and the release secrets the
chosen platforms need, with how to make them.

## Working against a checkout

```
pnpm dlx create-brock my-app --local X:\brock --yes --install
```

`--local` maps `brock-core`, `brock-electron`, `brock-react`, `brock-build` and
`brock-lint-config` to `packages/*` in that checkout, a module id to
`packages/modules/<id>`, and Tessera to the sibling `tessera` folder when there is one (the registry
version otherwise, as from a worktree). The spec is
`link:`, not `file:`: pnpm installs a `file:` directory as a package of its own and then
tries to resolve its dependencies, and the checkout's `workspace:*` siblings only resolve
inside the Brock workspace. A `link:` symlinks the folder and keeps its own
`node_modules`.

## What it writes

The template at `templates/app` in the Brock repo (or `template/` in the published
package), with `brock-template-app` / `Brock App` / `com.drizztdourden08.brock-template-app`
replaced by the new identity in `brock.config.ts`, `package.json`, the two HTML titles
and the README. The template's `workspace:*` specs become `^<brock version>` (or `link:`
specs with `--local`); its `catalog:` specs stay and the matching versions are written to
the new app's `pnpm-workspace.yaml` (`packages: []` plus the catalog, and
`onlyBuiltDependencies` for electron and esbuild), next to an `.npmrc` with the pnpm
settings every Brock repo uses. `brock sync` then writes `.brock/` and the managed
config files (eslint, stylelint, markdownlint, tsconfig, the Vite and electron-builder
configs, and for a standalone app `.github/workflows/ci.yml` and `release.yml` composed
from the chosen platforms). `brock.config.ts` gets `ports: { base }`, derived from the id
by `derivePortBase` (see brock-thread `/ports`), so the dev server port is written down and
can be changed. With `--modules`, the ids go into `brock.config.ts` and the packages into
`dependencies`; the module arrays fill on the next sync after `pnpm install`.

Every app starts with the modules the template's `brock.config.ts` lists, `updater` today,
so a new app has "Check for updates" and the update dialog from the first launch. The
module and the `peers` its manifest declares (`velopack` for the updater) go into
`dependencies` in both modes: read from the checkout with `--local` or when the scaffolder
runs from the Brock repo, and with `pnpm add` right after `--install` otherwise. A peer is
loaded by the module, not the app, so it also goes into `knip.json` `ignoreDependencies`.

The catalog is read from the Brock repo's own `pnpm-workspace.yaml` next to the
template, or from `template/pnpm-workspace.yaml` in the published package. The `prepack`
script (`src/pack-template.mjs`) copies `templates/app` and that file into `template/`,
with `.gitignore` stored as `_gitignore` so the registry keeps it.

A standalone app also gets its own command: `bin/<id>.mjs`, with `"bin"` and a
`postinstall` of `node bin/<id>.mjs --link` in `package.json` (see `brock-build`). The id
names the workspace in `brock.workspace.mjs` too, so it starts with a letter and is at
most 31 characters. A workspace member gets no command; the root's `brock adopt` writes it.
`brock create <dir> [...]` runs this scaffolder from the global `brock`.
