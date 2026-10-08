<!-- @layer docs @kind doc -->
# @drizztdourden08/brock-thread

The thread lifecycle every Brock repo runs: one git worktree per piece of work, launched in isolation, committed through the repo hooks and published through two verbs that ask.

```
<repo> worktree create <name> [--from <ref>] [--base <branch>] [--skip-install]
<repo> worktree launch <name> <state|none> [--target <key>] [--prod] [--visible [--sound]]
<repo> launch main <state|none> [--visible] [--review]
<repo> worktree refresh <name> [--reset] [--rebase [ref]]
<repo> worktree commit [name] --message "<text>"
<repo> worktree finish [name] | remove <name>
<repo> worktree base [name] [<new base>]
<repo> pr push | open | status [name]
<repo> upgrade [version] [--check] [--no-review] [--local <brockRepo>]
<repo> mobile push | build [--release] [--out <file>] | keystore
```

`worktree create` and `upgrade` start the new worktree from `origin/<base>` after a fetch (the thread base, see Thread bases), or from the local base branch when it is ahead of origin. When the two have diverged they stop and say so; `--from <ref>` picks the start by hand. `worktree create --skip-install` adds the worktree and runs its provision steps with no `pnpm install`, at the root or in a target app, for a thread that only writes a file, such as a release note. `launch` runs `brock sync --if-stale` in the app first, so a fresh checkout whose `.brock` is ignored or old launches with its generated files, and it stops with the sync's message instead of starting a renderer whose entry imports a missing file.

`main` names the main checkout. `launch main` runs the app from the repo root with its own `.user-data`, provisioned on the first launch, so a freshly scaffolded app runs before any worktree exists. No worktree verb accepts `main` as a name.

Without `--target`, `launch` picks the target whose app folder holds the folder it runs from (`pnpm --dir apps/desktop exec brock launch main none` launches `apps/desktop`), else the first target of `brock.workspace.mjs`.

A review with screenshot baselines (`--review --review-baselines` or `--review --review-bless`) runs on an emptied `<userData>-review` folder beside the target's data folder (`.user-data-review`), every launch, with no provisioning, so two runs start from the same state.

`<repo>` is the repository's own command (`my-app`, `tessera`): `bin/<repo>.mjs` at the repo root, written by `brock adopt` or `create-brock`. It is how you run everything in the repo; it reaches the global `brock`, which runs the Brock version the repo pinned. Every hint and usage line these verbs print names the workspace's command, never `brock`.

`mobile` drives the Capacitor Android project. It reads `mobile` from `brock.workspace.mjs`
when there is one, else the `capacitor.config.json` that `platform add android` writes at the app
root (`android.path` names `mobile/android`, the web build is `brock web build`). `build` runs the
web build, `cap sync` and `gradlew assembleDebug`; `--release` runs `assembleRelease` signed from
`BROCK_KEYSTORE_FILE`, `BROCK_KEYSTORE_PASSWORD` and `BROCK_KEY_ALIAS`, or from the keystore
`mobile keystore` made, and `--out` copies the APK there. `push` builds the debug APK and installs
it on the online device. `keystore` asks before `keytool` writes `~/.brock/keystores/<app id>.jks`
with a random password beside it, then prints the three `gh secret set` lines the release workflow
needs (`ANDROID_KEYSTORE_B64`, `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS`). It never runs them:
the values stay in their files and you run the lines yourself.

A repository describes itself in `brock.workspace.mjs` through `defineWorkspace`: its name (which is also the command's name), base branch, launch targets (`electronTarget`, `serveTarget`), provision steps and plugins. A plugin adds verbs, targets and steps through `definePlugin`.

## Thread bases

Each worktree has a base: the branch it starts from, rebases on, opens its PR into and lands on. It is the workspace `base` unless the thread names another, which is how a migration runs on an integration branch (`agent/grand-merge`) while `master` keeps moving.

- `worktree create <name> --base <branch>` sets it, and starts the worktree from that branch (`origin/<branch>` after the fetch, as for the workspace base). `--from <ref>` naming a branch origin has (`origin/agent/grand-merge`, or `agent/grand-merge` when origin has it) makes that branch the base too; `--base` wins over it. A `--from` that names a commit, a tag or a local-only branch leaves the workspace base. A base that is no branch here or on origin is refused before the worktree is added.
- `worktree base [name]` prints the base and where it comes from. `worktree base [name] <new base>` changes it; the workspace base removes the entry. With one word, a worktree of that name is shown; any other word is the new base of the worktree you stand in. It prints the `gh pr edit` line when an open PR targets another branch, and the `refresh --rebase` line, and runs neither.
- `refresh --rebase` rebases on `origin/<base>`; `--rebase <ref>` still picks any ref.
- `pr open` opens the PR into the base unless `--base` names another, and counts the commits over `origin/<base>`. `pr status` prints the PR's base and says when it is not the thread's.
- `finish` and `remove` treat the branch as landed when a merged PR has it as head, or its tip is on `origin/<base>` or the local base; landed, the branch is deleted, local and remote. An unlanded branch must be on its upstream, else on `origin/<base>`. A branch that some branch names as its base is never deleted with a worktree.

The base is stored in the repo's git config as `branch.<branch>.brockBase` (`git config branch.agent/feat.brockBase agent/grand-merge`), in the common `.git/config`, so every worktree and the main checkout read the same value. It belongs to the branch, not to the worktree folder: it survives `finish` or `remove` of an unmerged branch and comes back when `worktree create` resumes it, it follows `git branch -m`, and `git branch -D` deletes it with the branch. Git config is never cloned, so on a fresh clone a resumed branch with no entry takes the base of its open PR (`gh pr list --head`), and stores it; with no open PR it falls back to the workspace base until `worktree base` sets one. A worktree made before bases has no entry and runs on the workspace base, as before.

## Ports

`@drizztdourden08/brock-thread/ports` holds the port scheme. An app's block starts at `product.ports.base`: `+0` is the dev renderer, `+1` to `+9` are for its tools. `portFor(base, slot, offset)` returns one port and refuses an offset outside the block.

The main checkout is slot 0. `worktree create` runs the `port-slot` provision step, which gives the worktree the lowest slot from 1 that no other registered worktree holds and writes it to `.brock-port-slot` at the worktree root; the file name goes into `.git/info/exclude`. `launch` of an older worktree writes the file the same way. Slot N moves the block to `base + 10 x N`; slots stop at 19. `portSlotOf(dir)` reads `BROCK_PORT_SLOT`, then the file of the checkout holding `dir`, then 0.

`derivePortBase(id)` is the base when an app sets none: one of 140 multiples of 200 from 20000 to 47800, picked by an FNV-1a hash of the id.

## First time on a machine

1. `pnpm install` in the repo. Its postinstall (`node bin/<repo>.mjs --link`) writes the `<repo>` and `<repo>.cmd` shims into the npm global bin folder. Skipped when `CI` is set; it never fails the install.
2. Run `<repo>` once in a terminal. When the global `brock` is missing it asks to install `@drizztdourden08/brock` from GitHub Packages. Without a terminal it prints the install command and exits 1.

## Upgrading Brock

An app pins Brock once, in `package.json#brock.version`, and every Brock dependency follows that pin. `<repo> upgrade` moves the pin and proves the result before anything reaches the main checkout.

1. The target is the version given, else the newest `@drizztdourden08/brock-build` on the scope registry (`npm view`).
2. It creates the worktree `brock-<version>` (dots become dashes) through `worktree create`, so the main checkout stays untouched.
3. It finds the apps: the root when it holds `brock.config.ts`, else every workspace package that does (`apps/desktop` in a monorepo). It bumps `brock.version` in the root and in each app, moves every Brock dependency of the root, the apps and the other workspace packages to it, moves the Brock entries of the `pnpm-workspace.yaml` catalog, and runs `pnpm install` when a `package.json` or the catalog changed.
4. It prints the changelog between the two versions, read from the installed packages' `CHANGELOG.md`, else from the GitHub release notes.
5. In each app it runs the target's `brock sync`, then `brock migrate` from that app's old `brock.version` to the new one, with `--tessera-from` set to the app's `brock.tessera`, else the root's, else the Tessera installed before. Both pins are read in the main checkout, so a resumed upgrade starts from the same place.
6. The gate: `pnpm lint`, `typecheck`, `structure` and `test` at the root, then in each app (a missing script is skipped), `brock gate` in each app (the checks `gate` of its `brock.config.ts` adds), `brock icons` in each app, then `launch brock-<version> none --review` headless. `--no-review` skips the icons and the launch.
7. It writes `.brock/upgrade-report.md` in each app of the worktree and prints every path: the package.json fields changed, each step, each migration with the files it touched, the numbered to-dos and the changelog. The file stays out of git and serves as the PR body.
8. Green: it commits through `worktree commit` and prints the `pr open` command. It never opens the PR, since publishing asks. Red: it keeps the worktree, names the failed step and exits 1. Running it again resumes the same worktree.

`<repo> upgrade --check` compares only. It exits 0 when the app is current, 1 when it is behind and 2 when the registry cannot be reached, printing both versions. That exit code is the hook for a scheduled workflow that opens the upgrade PR each week; the workflow is not generated yet.

A linked Brock (`link:` specs from `create-brock --local`) follows its checkout. The target is the checkout's version and the upgrade runs sync, the migrations and the gate; migrations run with no upper bound, so the unreleased ones apply too. `--local <brockRepo>` switches a registry app to links into that checkout, which is how Brock's CI upgrades an app made at the previous release.

An app whose installed brock-build predates this verb gets it from the global `brock`, which runs its own brock-build for `upgrade` when the project's has none.
