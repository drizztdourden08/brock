<!-- @layer docs @kind doc -->
# @drizztdourden08/brock-thread

The thread lifecycle every Brock repo runs: one git worktree per piece of work, launched in isolation, committed through the repo hooks and published through two verbs that ask.

```
<repo> worktree create <name> [--prefix <text>] [--from <ref>] [--base <branch>] [--skip-install | --no-clone]
<repo> worktree launch <name> <state|none> [--target <key>] [--prod] [--visible [--sound]]
<repo> launch main <state|none> [--visible] [--review]
<repo> worktree refresh <name> [--reset] [--rebase [ref]]
<repo> worktree commit [name] --message "<text>"
<repo> worktree finish [name] | remove <name | path>
<repo> worktree base [name] [<new base>]
<repo> pr push | open | status [name]
<repo> pr merge --local PR-n
<repo> ci [check] [--commit <sha>] [--pr PR-n]
<repo> upgrade [version] [--check] [--no-review] [--local <brockRepo>]
<repo> mobile push | build [--release] [--out <file>] | keystore
<repo> linux push [--build-only] | doctor | init
```

A hidden launch passes `--no-focus --muted`, which makes it an automation launch (no dialogs, prompts or tour, off screen). `--visible` passes `--visible` and `--muted` (or `--sound`) and no automation flag, so the window behaves like a user launch. A worktree launch also passes `--instance=<name>`, an identity flag that does not make a launch automated.

`worktree create` and `upgrade` start the new worktree from `origin/<base>` after a fetch (the thread base, see Thread bases), or from the local base branch when it is ahead of origin. When the two have diverged they stop and say so; `--from <ref>` picks the start by hand. `worktree create --skip-install` adds the worktree and runs its provision steps with no `pnpm install`, at the root or in a target app, for a thread that only writes a file, such as a release note. `launch` runs `brock sync --if-stale` in the app first, so a fresh checkout whose `.brock` is ignored or old launches with its generated files, and it stops with the sync's message instead of starting a renderer whose entry imports a missing file.

`worktree refresh` (and `finish` and `remove`) stop on uncommitted changes, but not on the untracked files the worktree setup writes itself: `CLAUDE.md`, `.ai-config.json`, `.mcp.json`, `.brock-port-slot` and `.user-data/` (the list is in `src/worktree/generated-files.constants.mjs`). A tracked file with changes, even a tracked `CLAUDE.md`, and any other untracked file still block.

`worktree create` clones instead of installing when it can. When the main checkout, or the newest other worktree, has `node_modules` installed from a lockfile byte for byte equal to the new worktree's `pnpm-lock.yaml`, the new `node_modules` is made of links only: packages point into a shared copy of that checkout's package store (built once per lockfile, under `~/.brock/cache/node-modules` or `<volume>/.brock-store/node-modules`, or `BROCK_MODULES_STORE_DIR`), workspace packages into the new worktree. No link points into the source checkout. The content-keyed build records (`node_modules/.vite/brock-build-reuse`) come over too, and the generated outputs (`dist`, `guide`, brand icons) when the source's app folder matches the new commit, so the first launch reuses the main and preload bundles. No match, a link to nothing or any failure runs `pnpm install` as before; `--no-clone` always does. A plain `pnpm install` in a cloned worktree asks to recreate `node_modules` and never writes into the shared store. See [docs/worktree-clone.md](../../docs/worktree-clone.md).

`worktree create` puts a prefix before the name when one is set, so two coordination boards that share one checkout do not collide on worktree names (`rotp` and `rotp-web` both asking for `fix-menu`). The prefix comes from `--prefix <text>`, else the `BROCK_WORKTREE_PREFIX` environment variable, else `worktrees: { prefix: 'web' }` in `defineWorkspace` (`brock.workspace.mjs`), and none means today's names. It is letters, digits and dashes, starting with a letter or digit; a trailing dash is added (`web` and `web-` both give `web-`) and capitals are lowercased. `worktree create feat` then makes the folder `.worktrees/web-feat` on the branch `agent/web-feat`; a name that already starts with the prefix (`web-feat`) is used as given, so the prefix is never doubled. The other verbs (`refresh`, `commit`, `finish`, `remove`, `base`, `launch`, `pr`) take the name with or without the prefix, and a worktree made before the prefix was set is still found by its bare name. `--instance` and the port slot use the full name. `--prefix` is read by every worktree verb, so pass it there when the prefix is not in the config or the environment.

`worktree finish` and `remove` also work on Windows, where `node_modules` can hold paths past 260 characters. Every worktree git call runs with `-c core.longpaths=true`. Before `git worktree remove`, the worktree's ignored folders (`node_modules`, build output, found with `git ls-files --others --ignored --exclude-standard --directory`) are deleted through Node with absolute paths, which takes long paths. A pnpm link (junction or symlink) is removed itself and never followed, and every path is checked to sit inside the worktree folder, also after resolving the folder it lives in, or the delete is refused. A worktree with uncommitted tracked changes is refused and nothing is deleted. A locked file is retried five times with a short backoff; if it stays locked, the command names the path and the code (`EBUSY`, `EPERM`) and ends with the survivor message instead of hanging. Run the same `remove` again once the program holding it is closed. When git cannot remove the folder itself (for example "Function not implemented") and the delete above handles it, `remove` prints one plain line and hides git's message. Git's message is printed only when the folder survives.

Every delete in brock-thread goes through one function with four rules. It deletes only strictly inside the folder its caller owns, checked by path and by real path. It never follows a symlink or a junction: before anything else, every link in the worktree is removed as a link, because git for Windows follows a junction when it deletes a folder and deletes what it points to. It refuses a main checkout, a folder that holds one, and a folder with a `.git` folder anywhere inside. Its git calls drop `GIT_DIR`, `GIT_WORK_TREE` and the other variables that name a repository, so git always answers for the worktree itself. This came from a real loss on 2026-10-29: `git worktree remove --force` on a hand-made worktree whose `node_modules` were junctions into the main checkout deleted tracked files of that checkout. Never remove a worktree with plain git while it holds links; use `worktree remove`.

`worktree remove` also deletes the branch of an upgrade throwaway without a push or a merge: the branch the `upgrade` flow cut itself. It is recognised by the upgrade name (`brock-<major>-<minor>-<patch>`, after the branch prefix and the worktree prefix) and by its commits, which must all be `Upgrade Brock to <version>` or there must be none. A branch with any other commit, and any other unmerged branch, is still refused.

`worktree remove <path>` clears a leftover folder git no longer lists. The path (it has a slash in it) must sit inside the worktrees folder, must not be a registered worktree and must not hold your working directory. It is deleted the same long-path-safe way: links are never followed and nothing outside the folder is touched. No branch is changed.

`main` names the main checkout. `launch main` runs the app from the repo root with its own `.user-data`, provisioned on the first launch, so a freshly scaffolded app runs before any worktree exists. No worktree verb accepts `main` as a name.

Without `--target`, `launch` picks the target whose app folder holds the folder it runs from (`pnpm --dir apps/desktop exec brock launch main none` launches `apps/desktop`), else the first target of `brock.workspace.mjs`.

A review with screenshot baselines (`--review --review-baselines` or `--review --review-bless`) runs on an emptied `<userData>-review` folder beside the target's data folder (`.user-data-review`), every launch, with no provisioning, so two runs start from the same state.

`<repo>` is the repository's own command (`my-app`, `tessera`): `bin/<repo>.mjs` at the repo root, written by `brock adopt`, `create-brock` or `brock-thread link`. It is how you run everything in the repo; it reaches the global `brock`, which runs the Brock version the repo pinned. Every hint and usage line these verbs print names the workspace's command, never `brock`.

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

## Linux push

`linux` does for a Linux test VM what `mobile push` does for a phone: build the Linux AppImage, install its desktop entry, launch it on the VM's desktop.

```
<repo> linux init       write ~/.brock/linux/<repo>.json for this machine, print the one-time VM steps
<repo> linux doctor     ssh client, VirtualBox, the VM and its state, key-only access, Guest Additions, the build tools
<repo> linux push [--build-only]
```

The machine file holds `vmName` (the VirtualBox VM), `host`, `user`, `port`, `identityFile` (a private key; empty uses the ssh agent and the default keys; a WSL path such as `/home/me/.ssh/id_ed25519` is read through `\\wsl.localhost`), `builder` (`vm`, the default, or `wsl`) and `wslDistro`. `BROCK_LINUX_CONFIG` names another file. It never holds a password: a key named like a password, passphrase, secret, token or credential stops the command, and every ssh and scp call runs with `BatchMode=yes`, so a VM that wants a password fails with the reason instead of asking. On Windows the key file gets copied for the run into a temp folder only the user can read, as Windows OpenSSH requires, and removed after.

`push` refuses a VM VirtualBox does not know or that is not running. With `builder: 'vm'` it adds the current checkout as a transient VirtualBox shared folder, mounts it at `~/<repo>-src` (`sudo -n mount -t vboxsf`, so the VM user needs passwordless sudo for that mount or an fstab line), copies it with rsync to `~/<repo>` (leaving `node_modules`, `.git`, `dist`, `release`, `.user-data` and `.worktrees` out, and keeping the VM's own `node_modules`), runs `pnpm install` and the build in the app folder, and stages the newest `*.AppImage` of the artifact folder as `~/<id>.AppImage.incoming`. With `builder: 'wsl'` the same script runs in the WSL distro over `/mnt/<drive>/...`, and the AppImage is copied into the VM with scp. Then each share in `linux.shares` is mounted at `~/<name>`, the app icon (`public/logos/icon-256.png`) and a `~/.local/share/applications/<id>.desktop` entry are installed and pinned to the GNOME dock, the staged copy replaces `~/<id>.AppImage`, and the app starts detached on the logged-in desktop (Wayland when the session has a Wayland socket, else X11 on `:0`) with `--no-sandbox` and the launch flags; a launch that dies within 4 s prints the end of its log. `--build-only` stops after staging.

The repo side is optional, `linux` in `brock.workspace.mjs`:

```js
linux: {
  app: 'apps/desktop',                                // default: the first electron target
  build: ['pnpm', 'exec', 'brock', 'package'],        // the default, run in the app folder
  artifactDir: 'release/velopack',                    // the default, where the AppImage lands
  shares: [{ name: 'fixtures', path: 'tests/fixtures' }], // host folders the VM mounts before the launch
  launchFlags: ['--muted'],                           // the default
}
```

`setup-vm.sh` (its path is printed by `linux init`) sets a VM or a WSL distro up once: the build tools, rsync, Node 24 with pnpm, .NET 8 with vpk, the Electron runtime libraries and sshd. You run it in the VM yourself, and you authorize your key once with the line `linux init` prints; that is the only time the VM password is typed, by you, into ssh.

A repository describes itself in `brock.workspace.mjs` through `defineWorkspace`: its name (which is also the command's name), base branch, launch targets (`electronTarget`, `serveTarget`), provision steps and plugins. `workflows: { ci: 'own' }` there leaves the shared workspace `ci.yml` of a repo of several apps to the repo (docs/architecture.md, Workflows, App steps). A plugin adds verbs, targets and steps through `definePlugin`, and `workflows`: steps `brock sync` splices into the managed CI and release workflows of the repo's apps, in the shape of `workflows.steps` of `brock.config.ts` (docs/architecture.md, Workflows, App steps).

## Local mode

Owner order, 2026-10-29: development stays on this machine and GitHub is used only on the owner's go. The switch is `~/.coord/remote.json`, `{ "mode": "local" | "remote" }` (the folder is `COORD_HOME` when set). A missing, unreadable or odd file means `local`. `coord remote status|local|remote` shows and sets it.

In `local` mode this package never calls `gh` and never runs `git fetch`, `push`, `pull`, `ls-remote` or `clone`: the two helpers every verb goes through (`src/gh.mjs`, `src/git.mjs`) refuse them. `pr push`, `pr open` and `release` print what they would do on GitHub and that it waits for replay, and send nothing. `pr status` prints the commits ahead of the base and the newest local check run of the commit. `worktree create` starts from the local base without a fetch. In `remote` mode every verb works as before.

```
<repo> ci [check] [--commit <sha>] [--pr PR-n] [--job <job>|all] [--trigger push|pr|manual|release]
          [--only <step>[,<step>]] [--workflow <file>] [--project <key>] [--branch <name>] [--wait-minutes <n>]
<repo> pr merge --local PR-n [--head <branch> --base <branch>] [--keep-branch]
```

`ci` is the local CI. It makes a detached temporary worktree at the commit (default `HEAD`) in its own folder beside the checkout, `<parent>/.brock-ci/<repo folder>/ci-<id>`, outside every checkout of the repo, runs the steps of the repo's workflow there in order, and writes the record. `brock ci` runs the same verb. A step whose working directory leaves the temporary worktree, by its path or its real path, is not run and fails. The temporary worktree is removed at the end with the same safe removal as `worktree remove`, limited to that folder; if that refuses (tracked changes) it is left and the record says so. The runner notes the tracked files the main checkout already misses before the run and checks again after the removal: a tracked file deleted during the run fails the run with a summary that starts with `DATA LOSS`. The network is never used: an install is always the offline one (when the pnpm store cannot supply a package the step fails with a plain reason), and a step that needs the network fails with its own message.

The promise is that local CI runs the same steps as the GitHub workflow. The runner reads the repo's `.github/workflows/ci.yml` at the commit (`--workflow <file>` names another file of `.github/workflows`, or a path) and runs each job:

- A `run:` step runs in the job's working directory (`working-directory`, else `defaults.run.working-directory`) with the `env` of the workflow, the job and the step, in the shell the step names (`shell:`, else the `defaults`, else bash for a Linux or macOS `runs-on` and pwsh for a Windows one). Bash is Git Bash on Windows, never the WSL launcher. `pwsh`, `powershell`, `cmd` and `sh` work too. `GITHUB_WORKSPACE`, `GITHUB_EVENT_NAME`, `RUNNER_OS`, `RUNNER_TEMP` and `CI` are set.
- `${{ }}` is expanded only when it is simple: `env.X`, `matrix.X`, `github.event_name`, `runner.os`, `secrets.X` (empty in local mode), string and number literals, and `||` chains of those. Anything else (`github.sha`, a function) makes the step `skipped-local` with the expression named. `NODE_AUTH_TOKEN` is always empty. A `pnpm install` gets `--offline`, so a step that installs from the GitHub registry reads the local store instead.
- `uses:` steps: `actions/checkout` (the detached worktree is the checkout), `actions/setup-node`, `pnpm/action-setup` and `actions/cache` are no-ops that pass with a note (the local toolchain is used). `actions/upload-artifact` copies its `path` (files, folders, globs) to `~/.coord/ci/<project>/<runId>.artifacts/<name>/` before the worktree goes away, lists the files in the step's log and `artifact` field, and follows `if-no-files-found`. A job that calls the shared `standards` `ci.yml` expands to the install plus its gate scripts (the `gate.scripts` of `brock.workspace.mjs` win over its `scripts:` input; with neither it is `brock gate`). Any other `uses:` is `skipped-local` with the action's name.
- `needs:` is respected: a job runs after the jobs it needs, and when one of them failed it is recorded `not-run`. When a step fails, the rest of its job is `not-run` except steps with `if: always()` or `if: failure()`; independent jobs still run.
- `if:` that compares `github.event_name` uses the run's `--trigger` (`push`, `pr` is `pull_request`, `manual` is `workflow_dispatch`, `release`); a condition the runner cannot judge counts as true.
- A matrix runs the entries whose `os` (or `runs-on`) matches this machine; the other entries are `skipped-local` with the reason. A job without a matrix always runs here, whatever its `runs-on`; a step in it that needs Linux (`sudo`, `apt-get`, `sysctl`, `xvfb-run`) is `skipped-local` on Windows and macOS.
- Without a workflow file the steps are the install plus the `gate.scripts` of `brock.workspace.mjs`, else `brock gate`.

Every step is one record entry named `<job> / <step name or the first line of run>`, with the job in its `job` field (a matrix entry is `<job> (<values>)`, as GitHub names it). `publish: { requiredChecks: ['lint', 'quality'] }` in `brock.workspace.mjs` names the steps a merge needs, each by the full step name, the bare step name or the job; a job name makes every runnable step of the job required. The default is every step that runs. `--job` runs one job by its id, `--only` runs the named steps (and the gate install when a gate step is among them); the record is then marked `partial` and a merge refuses it.

Exit codes: 0 pass (or only skipped-local steps), 1 a step failed or the run was cancelled, 2 a usage or setup error, and then no record is written. The first line printed is the record path. One run per repo at a time: a second run writes a `queued` record, waits on `~/.coord/ci/<project>/.lock` (`--wait-minutes`, default 30) and starts when the first ends. The lock of a dead process is taken over. The project is `--project`, else `COORD_PROJECT`, else the workspace name.

Each run writes `~/.coord/ci/<project>/<runId>.json`, where `<runId>` is a sortable timestamp plus four hex digits (`20261029T154233123Z-a3f9`). The file is written whole (a temp file, then a rename) when the run is queued, when it starts, before and after every step, and at the end. Argus reads the folder; nothing is pushed to it.

```json
{
  "kind": "check-run", "id": "20261029T154233123Z-a3f9", "project": "brock", "repo": "X:/brock",
  "branch": "agent/x", "commit": "<sha>", "pr": "PR-3", "trigger": "manual", "mode": "local",
  "status": "queued | running | pass | fail | cancelled | skipped-local",
  "startedAt": "", "finishedAt": "",
  "steps": [{ "name": "quality / Lint and typecheck", "job": "quality", "command": "pnpm run lint", "cwd": "", "status": "pending | running | pass | fail | not-run | cancelled | skipped-local",
              "required": true, "startedAt": "", "exitCode": 0, "durationMs": 0, "log": "<path>", "note": "" }],
  "runner": { "host": "", "os": "", "node": "", "pnpm": "" }, "summary": ""
}
```

Each step's whole output is in `~/.coord/ci/<project>/<runId>.<NN>-<step>.log`, beside the record; `log` is that path. `note` appears on a skipped-local step, on a no-op action, on an artifact step and on a failed install.

`pr merge --local PR-n` is what `coord pr merge` calls in the project root. It reads the pull request from `coord pr list --json`; until `coord pr` exists, `--head <branch> --base <branch>` name it. It refuses, with a plain reason and exit 1, unless the newest check run of the head commit has finished, is not partial, and has every required step passing. Then it merges the head into the base where the base is checked out (a fast-forward when the base has not moved, else a merge commit; the work tree must have no tracked changes). On a conflict it aborts the merge, leaves the base as it was and lists the files. A head branch that is fully merged is deleted (`--keep-branch` keeps it). The last line printed is the merge commit.

```
<repo> release --local [--channel latest] [--integration <branch>] [--project <key>]
```

`release --local` is the release step with no workflow and no GitHub. Run it in a clean checkout whose HEAD is the tip of the integration branch (`--integration`, else the branch checked out at the project's `ciRoots` entry in `~/.coord/remote.json`, else the workspace base) with changesets pending. It cuts `release/local-<version>` (the version is the one the repo's packages share), runs `changeset version` and commits `release: version packages`. When the repo has a `release-notes/` folder, the note `release-notes/v<version>.md` must pass the release note standard: until it does, the command prints the file it expects and exits 2 on that branch, and running the same command again continues from there, commits the note as `docs: release notes v<version>` and goes on. It then packs every public package whose version moved with `pnpm pack` (the exact bytes a publish ships) into `~/.coord/releases/<project>/<channel>/<version>/`: `<scope>-<name>-<version>.tgz` for each package, `notes.md` and `release.json` (`kind: "release"`, `project`, `channel`, `version`, `tag`, `commit`, `createdAt`, `notes`, `packages` with `name`, `version`, `tarball`, `sha256` in hex, `sha512` in base64 and `size`, `assets`, and `replay: { state: "pending", at: null, url: null }`). Each file is written as a temp file and a rename, and `release.json` last, so a folder without it is not a release; a released version is never rewritten. The checkout returns to where it started, `coord pr open` records the pull request for the release branch (when `coord` is not reachable the exact command is printed), and nothing is merged: merge it with `coord pr merge` once its check run passes. The last line printed is the `release.json` path. App assets (electron-builder output, `latest.yml`) are not part of this command; `runLocalRelease` takes an `extraAssets` function that returns files to copy into the version folder and list in `assets`. Replay to the registry is a separate step.

```
<repo> replay plan [--project <key>] [--integration local/main] [--remote-base <branch>] [--json]
<repo> replay run --go [same options]
```

`replay` moves the local work to GitHub on the owner's go, byte for byte. `replay plan` runs nothing and prints, in order: (1) for each merged local pull request from `coord pr list --json` whose `replay.state` is not `done`, oldest merge first, push its head commit as its head branch and open a GitHub pull request against the base whose title and body say `merged locally as PR-n at <sha>`; (2) push the integration branch (`--integration`, default `local/main`) to `origin/<remote base>` (`--remote-base`, default the workspace base), after checking that `origin/<base>` as last fetched is an ancestor of it, else the plan marks the step BLOCKED and `run` stops before step 1; the push lands every head commit in the base, so GitHub marks those pull requests merged on its own and never reports "no commits between"; (3) for each `~/.coord/releases/<project>/<channel>/<version>/release.json` whose `replay.state` is not `done`, oldest first, `npm publish <tarball> --registry <registry>` for each package, the same tarball bytes, where the registry is the `@scope:registry` (else `registry`) line of the repo `.npmrc`, then `gh release create v<version> --notes-file notes.md` with the assets of `release.json`. `--json` prints the plan as data. `replay run` refuses with exit 2 unless remote mode is on (`coord remote remote`, otherwise it says `replay waits for the owner's go: coord remote remote`) and unless `--go` is given. It first verifies every pending tarball against the sha512 (and sha256) of its `release.json` and refuses on any mismatch before it sends anything, then runs the plan in order and stops at the first failure (exit 1). It is resumable: a release whose `replay.state` is `done` is skipped, a version that `npm view` already shows with the same integrity is marked done without publishing, a different integrity is a hard stop, and a pull request or GitHub release that already exists is reused. A release record gets `replay: { state: "done" | "failed", at, url }` through a temp file and a rename. `coord pr` has no verb to set `replay` on a pull request record yet, so for each pull request the run prints the exact `replay` value to record on it (`done` with the url, or `failed` when `gh pr create` refuses, and then the run stops before the base push). Every external command goes through one runner, so the tests stub them all.

## A repo that is not a Brock app

A library, a docs site or a tool repo gets the same `<repo>` command from this package alone. It needs brock-thread as a devDependency and a `brock.workspace.mjs`; it does not need brock-build.

```
brock-thread link [--force]    write bin/<name>.mjs, the package.json bin entry and the postinstall
brock-thread <verb> ...        run a thread verb straight from the repo's node_modules
```

`link` runs at the repo root and names the command after `name` in `brock.workspace.mjs`. It writes the same launcher `brock adopt` writes and adds `"bin": { "<name>": "./bin/<name>.mjs" }` and `node bin/<name>.mjs --link` to the `postinstall`, so a `pnpm install` links `<name>` into the npm global folder. A second run changes nothing. The launcher runs the global `brock`, which uses the repo's own brock-build when it has one, else its own, so the thread verbs run either way.

When the package already has a command of that name, `link` leaves `package.json` alone and the command forwards the verbs itself. `runThreadCli(argv)` from `@drizztdourden08/brock-thread/cli` runs a thread verb and returns its exit code, or `null` for any other word:

```js
import { runThreadCli } from '@drizztdourden08/brock-thread/cli';

const code = await runThreadCli(argv);
if (code !== null) return code;
```

`link` checks that the command's file mentions `runThreadCli` and prints these lines when it does not. In that case the command is the one `pnpm exec <name>` runs; no global `<name>` is linked.

Tessera, for example, adds:

1. `@drizztdourden08/brock-thread` in `devDependencies`.
2. `brock.workspace.mjs` with the catalogue as a target:

   ```js
   import { defineWorkspace, serveTarget } from '@drizztdourden08/brock-thread';

   export default defineWorkspace({
     name: 'tessera',
     base: 'main',
     targets: { storylite: serveTarget({ command: ['storylite', 'dev'], port: 4400 }) },
   });
   ```

3. The two lines above in its `tessera` bin, `scripts/cli/tessera.mjs`, before it handles `new`, `check` and `guide`.

Then `pnpm exec tessera launch <worktree> none --target storylite` prints the catalogue URL for that worktree.

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
6. The gate, the documented one CI runs (the report's step table lists every step, those after a failed one as not run): `pnpm install --frozen-lockfile` at the root, `brock check` in each app (drift, a managed workflow git ignores, a missing `packageManager`), `pnpm lint`, `typecheck`, `lint:md`, `structure` and `test` at the root, then in each app (a missing script is skipped), `brock gate` in each app (the checks `gate` of its `brock.config.ts` adds), `brock icons` in each app, then `launch brock-<version> none --review` headless. `--no-review` skips the icons and the launch.
7. It writes `.brock/upgrade-report.md` in each app of the worktree and prints every path: the package.json fields changed, each step, each migration with the files it touched, the numbered to-dos and the changelog. The file stays out of git and serves as the PR body.
8. Green: it commits through `worktree commit` and prints the `pr open` command. It never opens the PR, since publishing asks. Red: it keeps the worktree, names the failed step and exits 1. Running it again resumes the same worktree.

`<repo> upgrade --check` compares only. It exits 0 when the app is current, 1 when it is behind and 2 when the registry cannot be reached, printing both versions. That exit code is the hook for a scheduled workflow that opens the upgrade PR each week; the workflow is not generated yet.

A linked Brock (`link:` specs from `create-brock --local`) follows its checkout. The target is the checkout's version and the upgrade runs sync, the migrations and the gate; migrations run with no upper bound, so the unreleased ones apply too. `--local <brockRepo>` switches a registry app to links into that checkout, which is how Brock's CI upgrades an app made at the previous release.

An app whose installed brock-build predates this verb gets it from the global `brock`, which runs its own brock-build for `upgrade` when the project's has none.
