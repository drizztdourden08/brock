<!-- @layer docs @kind doc -->
# @drizztdourden08/brock-thread

The thread lifecycle every Brock repo runs: one git worktree per piece of work, launched in isolation, committed through the repo hooks and published through two verbs that ask.

```
<repo> worktree create <name> [--from <ref>]
<repo> worktree launch <name> <state|none> [--target <key>] [--prod] [--visible [--sound]]
<repo> launch main <state|none> [--visible] [--review]
<repo> worktree refresh <name> [--reset] [--rebase [ref]]
<repo> worktree commit [name] --message "<text>"
<repo> worktree finish [name] | remove <name>
<repo> pr push | open | status [name]
<repo> mobile push | build [--release] [--out <file>] | keystore
```

`main` names the main checkout. `launch main` runs the app from the repo root with its own `.user-data`, provisioned on the first launch, so a freshly scaffolded app runs before any worktree exists. No worktree verb accepts `main` as a name.

`<repo>` is the repository's own command (`archipelia`, `tessera`, `rotp`): `bin/<repo>.mjs` at the repo root, written by `brock adopt` or `create-brock`. It is how you run everything in the repo; it reaches the global `brock`, which runs the Brock version the repo pinned. Every hint and usage line these verbs print names the workspace's command, never `brock`.

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

## First time on a machine

1. `pnpm install` in the repo. Its postinstall (`node bin/<repo>.mjs --link`) writes the `<repo>` and `<repo>.cmd` shims into the npm global bin folder. Skipped when `CI` is set; it never fails the install.
2. Run `<repo>` once in a terminal. When the global `brock` is missing it asks to install `@drizztdourden08/brock` from GitHub Packages. Without a terminal it prints the install command and exits 1.
