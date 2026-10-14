<!-- @layer docs @kind doc -->
# brock-tools

External programs an app needs but does not ship, such as ffmpeg and ffprobe. The app declares each tool; the module finds it in `Data/tools` or on `PATH`, downloads and checks it where the app gives a download, installs it as a job the job dialog shows, and runs it with an argument array.

## Install

```sh
brock add tools
```

`brock sync` imports the module on all three sides. The tool list stays empty until the app registers its tools.

## Declare a tool

A tool is a `ToolDef`. Register it from a main boot task, `onReady` or the app services, before the renderer asks for it:

```ts
// electron/boot/tools.task.ts
import { defineBootTask } from '@drizztdourden08/brock-electron/main';
import { getTools } from '@drizztdourden08/brock-tools/main';

export default defineBootTask({
  label: 'Tools',
  run: (ctx) => {
    getTools(ctx).register({
      id: 'ffmpeg',
      label: 'FFmpeg',
      binaries: ['ffmpeg', 'ffprobe'],
      version: '9.0',
      downloads: {
        'win32-x64': {
          url: 'https://github.com/BtbN/FFmpeg-Builds/releases/download/n9.0/ffmpeg-n9.0-latest-win64-lgpl-9.0.zip',
          sha256: '<the 64 hex digits of the release asset>',
          archive: 'zip',
        },
      },
      installHint: 'Install the ffmpeg package with your package manager.',
    });
  },
});
```

| Field | Meaning |
|---|---|
| `id` | A slug. The install job is `tool:<id>` and the copy lives in `Data/tools/<id>/<version>/`. |
| `label` | The name the job dialog and the hint show. |
| `binaries` | Every program the tool must hold, without `.exe`. A tool is ready only when all of them are found in one folder. |
| `version` | The cache folder, `current` by default. A new version installs beside the old one and the old one is no longer read. |
| `downloads` | One `ToolDownload` per platform key, `<os>-<arch>` with `win32`, `darwin` or `linux` and `x64` or `arm64`. |
| `resolveDownload` | `(platform) => Promise<ToolDownload \| null>`, for a download found at run time, such as a GitHub release asset whose API digest carries the checksum. A fixed entry for the platform wins. |
| `usePath` | Look on `PATH` when there is no cached copy. On by default; a copy found there is used as it is, with no checksum. |
| `installHint` | Shown when the platform has no download and nothing was found. |
| `probe` | Optional. Checks a found copy works before it counts, and reads its version (see below). |
| `aroundRun` | Optional. `(call, next) => Promise<ToolRunResult>` around every run of the tool (see below). |

`ToolDownload` is `{ url, sha256, size?, archive? }`. The URL must be http or https. `archive` is `zip` (the default, read with Brock's zip reader), `tar` (any tar the system `tar` reads, `.tar.xz` included; on Windows the one in `System32`) or `none` (the download is the one binary). `defineTool` refuses a bad id, a binary name with a folder or `.exe`, a checksum that is not 64 hex digits and a URL that is not http or https; a resolved download is checked the same way before it is fetched.

## Locate, install, run

```ts
const tools = getTools(ctx);
await tools.state('ffmpeg');          // ToolState: { status: 'ready' | 'missing' | 'unavailable', source: 'cache' | 'path' | null, paths, canInstall, hint }
await tools.install('ffmpeg');        // Result<ToolState>
await tools.run('ffmpeg', 'ffprobe', ['-v', 'quiet', '-print_format', 'json', '-show_format', file], { timeoutMs: 30_000 });
```

- `locate` reads the cached copy first, then each `PATH` folder in order. The PATH is read again on each lookup, at most every 2 s: on Windows the process PATH merged with the saved machine and user PATH from the registry (`systemPath()`), so a tool the user installs while the app runs is found; elsewhere the process PATH. `createTools` takes `pathEnv` as a string or a function. `missing` means a download exists for this platform; `unavailable` means none does, and `hint` says what to do.
- `install` runs one job, `tool:<id>`, with the steps Download (progress in bytes), Verify and Unpack; cancel is turned off once the download is in. The download streams to the temp folder through Electron's `net.fetch`; its size (when given) and SHA-256 must match before anything is unpacked, and a mismatch deletes it. The binaries are found by file name anywhere in the archive and moved into the cache folder in one rename, so a failed install leaves the previous copy alone. Two calls for one tool share the same install. The job can be cancelled from the job dialog.
- `run` spawns the binary with no shell, `windowsHide`, and a timeout (10 minutes by default) that kills it and sets `timedOut`. `onLine(line, stream)` receives each line of stdout and stderr as it arrives, which is where an app reads ffmpeg's `time=` progress and moves its own job. It resolves `{ code, stdout, stderr, timedOut }` and rejects only when the program cannot start.

## Probe and run hook

```ts
getTools(ctx).register({
  id: 'converter',
  label: 'Converter',
  binaries: ['convert'],
  probe: { args: ['-version'] },                              // or (paths) => Promise<{ ok, version?, error? }>
  aroundRun: (call, next) => next({ ...call, options: { ...call.options, env: { ...process.env, LANG: 'C' } } }),
});
```

- `probe: { binary?, args?, timeoutMs?, read? }` runs `binary` (the first one by default) with `args` (`--version` by default, 15 s at most) on each copy `locate` finds. `read(output)` returns `{ ok, version?, error? }`; the default (`readVersion`) passes on exit code 0 and takes the first dotted number of the output as the version. A function in its place gets the found paths and answers the same. A copy that fails counts as not found, so the lookup moves on to the next folder; a passing one puts `version` on `ToolLocation` and `ToolState`. A result is kept until a binary's size or modified time changes. `defineTool` refuses a probe of a binary the tool does not list.
- `aroundRun(call, next)` gets `{ binary, file, args, options }` for every run of the tool, the probe included, and calls `next` with the same call or a changed one; it can log, set the environment, retry or rewrite the result.

## Renderer

`window.api.tools` has `list()`, `state(id)`, `install(id)` and `onChanged(listener)`, which hears `tools:changed` with the tool id after an install. `useTool(id, { refreshOnFocus? })` returns `{ state, installing, error, install, refresh }`; `install` opens the job dialog on `tool:<id>` and resolves `true` once the tool is ready. It locates the tool again on `tools:changed` for its id and, unless `refreshOnFocus: false`, each time the window gets focus, so a tool installed outside the app shows once the user comes back.

## What it stores

| Path under `Data/` | Holds |
|---|---|
| `tools/<id>/<version>/` | The binaries of one tool, nothing else. |
