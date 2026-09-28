<!-- @layer docs @kind doc -->
# brock-updater

Self-update through Velopack. The module runs the Velopack startup hooks, checks the product's GitHub releases, lists every installable version, downloads the chosen one with progress, and hands the swap to Velopack. The renderer side adds a version tag to the title bar, a "Check for updates" menu entry and the UpdateDialog.

## Where updates come from

The feed is the product's `repo` in `brock.config.ts`. Without a `repo` the module is inert: nothing is checked and the dialog says so.

| Input | Effect |
|---|---|
| `product.repo` | `github.com/<owner>/<name>` releases, tagged `v<version>` |
| `<ENV_PREFIX>_UPDATE_API_ORIGIN` | Reads the release list from another origin, a fixture server. A dev run then checks and lists like a packaged build. |
| `--update-source=<dir>` | Velopack reads packed releases from a local folder in place of GitHub. |
| channel | `win`, `osx` or `linux` by platform, or `product.updateChannel` when set. The picker reads `releases.<channel>.json` from the newest release that has one. |

A build that Velopack did not install (a dev run, a portable copy) cannot apply an update. A packaged build still checks, and its dialog sends the user to the release page.

## What it stores

| Path under `Data/` | Holds |
|---|---|
| `updater/prefs.json` | `{ allowPrerelease }`, off by default. It is app wide, not per profile. |

## Install

```sh
brock add updater
```

`velopack` loads from `node_modules` at runtime, so the app declares it too. The manifest lists it under `peers`, and `brock add updater` adds it to the app.

`brock sync` then imports the module on all three sides. The preload adds `window.api.updater`:

```ts
window.api.updater.capabilities()           // { canCheck, canInstall }
window.api.updater.getVersion()
window.api.updater.check()                  // UpdateInfo | null
window.api.updater.getAvailable()
window.api.updater.listVersions()           // VersionOption[], newest first
window.api.updater.apply(version | null)    // null takes the newest
window.api.updater.openReleasePage(version | null)
window.api.updater.getPrefs()
window.api.updater.setPrefs({ allowPrerelease })
window.api.updater.onUpdateAvailable((info) => ...)
window.api.updater.onDownloadProgress(({ percent }) => ...)
```

`onUpToDate`, `onDownloadComplete` and `onError` complete the events.

## Main side

`onBoot` runs `VelopackApp.build().run()` before anything else in `bootstrapApp`, because an install, update or uninstall hook may exit or restart the process. The first check runs 5 s after the window opens and is skipped on a headless automation launch.

An app that needs the Velopack fast callbacks (a file association written on install, removed on uninstall) builds its own module and passes it in place of the synced one:

```ts
import { createUpdaterMain } from '@drizztdourden08/brock-updater/main';

const updater = createUpdaterMain({
  hooks: { afterInstall: registerFiles, afterUpdate: registerFiles, beforeUninstall: unregisterFiles },
  channel: 'beta',
  firstCheckDelayMs: 10_000,
});
```

`hooks` also takes `beforeUpdate`, `firstRun` and `restarted`. `channel` sets Velopack's `ExplicitChannel` and wins over `product.updateChannel`.

## Versions and deltas

Every row in the picker carries a plan: the base release and the ordered deltas that walk from the installed version to the target. The size shown and the bytes fetched both come from that plan. A downgrade, a reinstall, a missing delta or a chain longer than 10 falls back to the full package.

## Renderer side

The module's `Provider` connects the store and mounts the UpdateDialog.

The updater never interrupts. The startup check is silent, and the dialog opens only when the user asks for it:

| Where | What it does |
|---|---|
| Title bar version tag | `v<version>` beside the title, contributed through `RendererModule.titleBar`. A found update tints it and adds a dot. A click opens the dialog on the found update, or runs a check and opens the dialog when there is none. The dialog shows the release notes of the chosen version. |
| Menu entry | "Check for updates" runs a check and opens the dialog. |

`VersionTag` is exported too, for an app that draws its own title bar. `useUpdaterStore` holds the state for an app that wants its own badge or button:

```tsx
const status = useUpdaterStore((s) => s.status);            // idle, checking, available, downloading, ready, error
const checkAndOpen = useUpdaterStore((s) => s.checkAndOpen);
```

Release notes show as plain text.

## Shipping updates

`brock package` builds what this module reads: electron-builder makes the app tree, and `vpk pack` turns it into the update package, a delta against the previous release, the `releases.<channel>.json` feed and, on Windows, the installer. The release workflow that `create-brock` and `brock adopt` write runs it on each platform and uploads the result to the GitHub release, with `release-notes/v<version>.md` as the body. The notes also travel inside the package, which is how the dialog shows them. `docs/architecture.md` has the full sequence.
