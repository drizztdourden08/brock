<!-- @layer docs @kind doc -->
# create-brock

The scaffolder. It copies the blank app, writes the identity into it, wires the
dependencies, writes the pnpm files and runs the first `brock sync`.

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
--modules a,b          Brock module ids to install and record
--local <path>         Brock checkout; every @drizztdourden08/* dependency becomes a link: spec
--tessera <path>       Tessera checkout (default: <local>/../tessera)
--yes                  accept the defaults, ask nothing
--install              run pnpm install after scaffolding
```

Without `--yes`, each identity field no flag supplied is asked for on the terminal,
with the default shown. The target folder must be empty or absent.

## Working against a checkout

```
pnpm dlx create-brock my-app --local X:\brock --yes --install
```

`--local` maps `brock-core`, `brock-electron`, `brock-react`, `brock-build` and
`brock-lint-config` to `packages/*` in that checkout, a module id to
`packages/modules/<id>`, and Tessera to the sibling `tessera` folder. The spec is
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
configs). With `--modules`, the ids go into `brock.config.ts` and the packages into
`dependencies`; the module arrays fill on the next sync after `pnpm install`.

The catalog is read from the Brock repo's own `pnpm-workspace.yaml` next to the
template, or from `template/pnpm-workspace.yaml` in the published package. The `prepack`
script (`src/pack-template.mjs`) copies `templates/app` and that file into `template/`,
with `.gitignore` stored as `_gitignore` so the registry keeps it.

A standalone app also gets its own command: `bin/<id>.mjs`, with `"bin"` and a
`postinstall` of `node bin/<id>.mjs --link` in `package.json` (see `brock-build`). The id
names the workspace in `brock.workspace.mjs` too, so it starts with a letter and is at
most 31 characters. A workspace member gets no command; the root's `brock adopt` writes it.
`brock create <dir> [...]` runs this scaffolder from the global `brock`.
