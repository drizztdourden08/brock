<!-- @layer docs @kind doc -->
# The app's launch suite and kept end-to-end tests

While an app is worked on, it is launched through its thread verbs (`<app> worktree launch`, `<app> launch`), often on a machine where the owner's own session of the same app is running. A regression in those verbs costs that session. So an app keeps a written launch suite, run by hand over the verbs, and a set of kept end-to-end tests, run by `vitest` against the built app. This page says where each one lives, how the suite is written and run, and how the coverage registry tracks both.

| What | File | Run by |
|---|---|---|
| Launch suite | `tests/launch-suite.md` | a person, every case in one pass |
| End-to-end tests | `tests/e2e/<name>.e2e.ts` | `vitest`, through `launchAppForTest` |
| Review steps | `src/review/<id>.step.ts` | `<app> launch main none --review` ([review-steps.md](review-steps.md)) |
| Coverage registry | `tests/COVERAGE.md` | read before a change, updated with every kept test |

A flow the review can drive is a review step, so it lands in the one report. An end-to-end test is for what needs Playwright: a second launch, two windows, the files left after quit (see Automated review in [architecture.md](architecture.md)).

## Kept tests

A test is kept when the owner asked for that test. A kept unit test is `tests/<area>/<name>.keep.test.ts` and a kept end-to-end test is `tests/e2e/<name>.e2e.ts`. A test written to check one change runs, then goes; it never reaches a commit under a kept name, and an existing test is never renamed to a kept name without that ask.

## When the suite runs

The launch suite gates any change to:

- the thread verbs the app runs (`worktree create`, `launch`, `refresh`, `remove`, `finish`), or the Brock version that brings them;
- the app's launch flags, its launch targets in `brock.workspace.mjs` and its provision and build steps;
- the permission rules and guard hooks around those verbs.

## How it is run

Every case, in order, in one pass, in a worktree created for the run. A failed case ends the pass: fix the cause, remove the worktree and start again at the first case. A code change during a pass counts as a failure, so the pass restarts.

Each case says who confirms it:

| Mark | Confirmed by |
|---|---|
| `owner` | the owner, in writing: they saw the window, heard the sound, got the permission prompt. A screenshot, an exit code or a process listing does not stand in for that. |
| `auto` | output anyone can read again: an exit code, a file on disk, a line in the log. |

A case that the tooling refuses outright never reaches the owner, so it is `auto`. Only a case that asks for permission is `owner`.

## Writing the suite

`tests/launch-suite.md` opens with one paragraph on what the suite protects, then one section per group of cases. Each section is a table with four columns: the case number, the command, what to expect, and who confirms it. Numbers are never reused: a new case takes the next free number wherever it sits, so a report that names a case means one case. Commands use the app's own command (`archipelia`, `rotp`), never `brock`.

The groups every Brock app has, with a starting set of cases:

| # | Command | Expect | Who |
|---|---|---|---|
| L1 | `<app> worktree create <n>` | its own `node_modules`, a `.brock-port-slot`, and a `.user-data/` holding what the provision steps write | auto |
| L2 | `<app> worktree create <n> --skip-install` | the worktree is added and provisioned, with no install run | auto |
| L3 | `<app> worktree launch <n> none` | headless with `--no-focus --muted`, no window on any display, the owner's session untouched | auto |
| L4 | `<app> worktree launch <n> none --visible` | a window, the app only, silent | owner |
| L5 | `<app> worktree launch <n> none --visible --sound` | a window with sound | owner |
| L6 | `<app> worktree launch <n> <unknown state>`, in an app whose target declares states | refuses and names the state, never boots other data | auto |
| L7 | `<app> launch main none --review` | the review report, exit 0 | auto |
| L8 | `<app> worktree refresh <n>` | back to as created, `.user-data` kept, the branch not moved | auto |
| L9 | `<app> worktree refresh <n> --reset` | `.user-data` removed and provisioned again | auto |
| L10 | `<app> worktree refresh <n> --rebase <ref>` that conflicts | the rebase is aborted and reported, the branch and the tree unchanged | auto |
| L11 | `<app> worktree remove <n>` with uncommitted work | refuses | auto |
| L12 | `<app> worktree remove <n>` while that instance runs | refuses, kills nothing | auto |
| L13 | `<app> worktree remove <n>` clean, branch not landed | the worktree goes, the branch stays | auto |
| L14 | `<app> worktree remove <n>` clean, branch landed on its base | the worktree and the branch go, local and remote | auto |
| L15 | `<app> worktree finish` from inside the worktree | the same checks as `remove`, then the worktree and the branch retired | auto |

An app adds its own groups after these: its launch states (a game state, a saved file), its targets (a dev server, a side web app), its plugins (`snes rom check`), and dev against `--prod` when its build has both. The guard and permission cases (which launch shapes are refused, which verbs ask) are written beside the guard configuration, outside the repo, and listed in the suite by number only.

A last section, Standing traps, lists in a sentence each the mistakes that already cost a pass, so the next change does not repeat them.

## The coverage registry

`tests/COVERAGE.md` maps each area of the app to the kept tests that cover it, with a verdict of covered, partial or none, so a gap shows at a glance. It is a maintained registry, not a snapshot:

- A summary table at the top counts the areas per verdict.
- One table per part of the app (screens, widgets, views, main process handlers, modules, packages), one row per area.
- Each row names the kept tests (`tests/<area>/*.keep.test.ts`, `tests/e2e/<name>.e2e.ts`, review steps by id) and the verdict. A partial row says what is missing.
- Adding, removing or moving a kept test updates its row in the same commit, and the summary is counted again when a verdict changes.

```md
| Verdict | Areas |
|---|---|
| covered | 12 |
| partial | 3 |
| none | 5 |

## Widgets (`src/widgets/`)

| Area | Tests | Verdict |
|---|---|---|
| Sessions widget | tests/sessions/session-list.keep.test.ts | partial. The pop-out window is untested |
| Dock layout preset | tests/e2e/dock-preset.e2e.ts | covered |
```
