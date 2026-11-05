<!-- @layer docs @kind doc -->
# brock-msu

The shared MSU-1 and MSU-L music module. It plays layered music packs over a running game core and holds no game in it. The pack format, the player, the pack storage and the session that follows the game live here. The game supplies the rest.

## The game config

A game calls `defineMsuGame` once and passes the result to the module.

| Field | Meaning |
|---|---|
| `id` | The game id. A pack may name it in `meta.game`; a pack without one fits any game. |
| `packRoot` | The folder under the app data where packs live. |
| `soundChannels` | The sound channels: name, kind (`stateful` or `additive`), bus, core index, preview length. |
| `soundIdCount` | How many sound ids a channel has. The claim mask is sized from it, up to 64. |
| `trackLoops` | Whether a track loops. |
| `classifyMusic` | Turns a raw music control value into a track, a fade or an ignore. |
| `musicLabels`, `isTitleScene`, `variants` | Optional labels, title scene test and track remaps per variant. |
| `resumePath` | The save path of the resume state for a profile and slot. |

`defineMsuGame` throws when two channels share a name or a core index.

## The host

The core is reached through an `MsuHost`: the audio target, the switch from core music to external music, the sound claims that mute the core's own sounds, and optional hooks for variants, tracing and rendering an original sound.

## Entry points

| Import | Holds |
|---|---|
| `@drizztdourden08/brock-msu` | The types, `defineMsuGame`, `MSUL_MANIFEST_NAME` and `parseManifest`. |
| `@drizztdourden08/brock-msu/format` | The MSU-1 format constants and frame count. |
| `@drizztdourden08/brock-msu/packs` | Pack storage and editing. |
| `@drizztdourden08/brock-msu/player` | The layered music engine. |
| `@drizztdourden08/brock-msu/session` | The session that follows a running game. |
| `@drizztdourden08/brock-msu/augment` | The IPC contract of the `msu` namespace. |
| `@drizztdourden08/brock-msu/main` | The main process handlers: `.msul` read, optimize, audio probe. |
| `@drizztdourden08/brock-msu/preload` | The preload bridge of the `msu` namespace. |
| `@drizztdourden08/brock-msu/renderer` | The studio game config, the music debugger widget, file audition and `.msul` open. |

## Studio

The studio is the UI side. A game calls `defineMsuStudio` with its `MsuGameConfig` and the pieces the UI cannot guess: track names, base and extended slot counts, sound tabs, the sound source and an optional preview binding. `defineMsuStudio` throws when a sound tab names a channel the config does not have, and fills the rest with defaults.

Wrap the studio screens in `MsuStudioProvider` and read the game with `useMsuStudioGame`. The music debugger is the `MusicDebuggerWidget` with its `MUSIC_DEBUGGER_META`; it reads the channel names, titles and layer slot counts from `game.debug`.

On the main side, call `configureMsuMain` once with the game and the pack write guard, then register `msuMain`. ffmpeg is reached only through the tools module, so the app adds the tools module and the `ffmpegTool` definition comes from this one. `useMsulOpen` imports a `.msul` file that the app is asked to open.
