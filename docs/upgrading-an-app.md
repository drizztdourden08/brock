<!-- @layer docs @kind doc -->
# Upgrading an app to the current Brock

This guide is for the thread that owns an app built on Brock (Archipelia today, RotP later). It covers how to move the app to the current releases, which rules the gate now enforces, and how to report what you find.

## Versions

Every package of the family stays below 1.0. A breaking change bumps minor, a fix bumps patch, and no changeset says `major`: `standards sync --check` rejects one that does.

| Package | Range to use |
|---|---|
| `@drizztdourden08/brock-*` | the latest published minor, e.g. `^0.9.0` |
| `@drizztdourden08/tessera` | brock-react's peer range; `upgrade` moves the app there for you |
| `@drizztdourden08/standards` | comes through `brock-lint-config`; list it only if the repo calls `standards` directly |

Use published ranges, not `link:` paths into a local checkout. A `link:` spec ties the app to whatever state that checkout is in, and the upgrade path, the CI and the review all assume published versions. Link only while you are co-developing a change in Brock or Tessera, and go back to ranges once it ships.

## The upgrade, step by step

1. Commit or finish open work first. `upgrade` runs in its own worktree from the current `main`.
2. `<app> upgrade --check` says how far behind the app is.
3. `<app> upgrade` creates the worktree, bumps the Brock packages, moves Tessera to the range Brock asks for, runs `pnpm install`, runs every Brock migration after the app's `brock.version`, replays Tessera's `RENAMES.json` after the app's `brock.tessera`, then runs the gate (lint, typecheck, structure, test) and the review.
4. Read `upgrade-report.md` in the worktree. Every to-do names a file, a line and what to change. Mechanical renames are already done; the to-dos are the changes that need a person.
5. When the gate is green and the review passes, merge the worktree branch.

`brock migrate --from <version> [--tessera-from <version>]` runs the same migrations by hand, for example after a partial upgrade.

## What the gate enforces

### Files and code

- Every file starts with the `@layer … @kind …` header.
- No comments in code, apart from the header and directives. Name things so the code reads on its own; notes go in a doc page.
- One exported value per implementation file. Types live in `*.type.ts`, `UPPER_SNAKE` constants in `*.constants.ts`, lists in `index.ts`.
- No placeholder or qualifier names (`temp`, `data2`, `EnhancedX`, `xHelper`, `xUtils`).
- Component folders hold `Name.tsx`, `index.ts` and optionally `Name.css`, `Name.type.ts`, `Name.constants.ts`, `Name.usage.ts`, `behavior/` and `sub-components/`.

### Wording

The prose checks run on comments, strings, Markdown, other text files and pull requests. They report stock phrasing, filler adverbs, slop vocabulary, em and en dashes, curly quotes, emoji, and tool brand words (the names of assistant products and the generic terms for them). Rewrite the sentence; do not swap the character. A project allows a legitimate word with `prose.allow`.

### Ignored files

`.gitignore` ignores every dot-folder with `.*/`, keeps a short note at the top that explains the convention, and lists exceptions only for tracked dot-folders (`.github/`, `.changeset/`, `.vscode/extensions.json`). Never name a tool's folder. Every check skips what git ignores. Run knip through `brock knip`, which stays correct inside worktrees.

### Tessera parts

- `tessera.config.json` sits at the repo root. In a monorepo the shared design-system parts live in a workspace package, `packages/design` (`@<scope>/design`), and each app keeps its own views under `apps.<path>.parts.views`.
- `guide.usage` is `report` or `enforce`. In `enforce`, every component folder inside `parts` needs a `Name.usage.ts`.
- `brock tessera new compound <Name>` scaffolds a part where the config says, and `brock tessera check` runs the usage checks.

## Conventions an app now follows

- **Screens:** `src/screens/screens.config.ts` declares the buckets; files are picked up by name (`.hero.tsx`, `.page.tsx`, `<page>/<tab>.tab.tsx`, `.settings.ts`, `.custom.tsx`, `.card.tsx`, `.layer.tsx`). Every screen has an icon and a title.
- **Settings rows:** each row has a `description`, or `noDescription: true` when there is nothing to say, and always a `hint`, shown on hover of the control.
- **Title bar:** buttons are actions. Search, Report a bug and Check for updates are standard; a module adds its own through `titleBarActions`. `product.window.titleBar.controls` turns window buttons off.
- **Brand:** `product.icons.brand` picks the Tessera brand and `product.icons.rim` (`light` or `dark`) the rimmed logo set; `brock icons` copies them.
- **Widgets:** declare them with `defineWidget`. Popping out, syncing with the main window, groups, snapping and resizing are Brock's; never add window code of your own.
- **Built-in compounds:** `AboutPanel`, `ReleaseNotesPanel` and `ProfilesPanel` come from brock-react, `CalibrationPanel` from `brock-input/renderer`. Use them; do not copy them.
- **Boot and splash:** boot tasks are `src/boot/*.task.ts` and `electron/boot/*.task.ts`; the splash and the installer come from `brock.config.ts`.
- **Review:** `<app> launch main none --review` must pass, and so must the packaged run after `pnpm build` (`--prod --review`).

## Reporting

Report while you work, not at the end. Every report says what happened, where (file and line, in the app and in the Brock or Tessera package), how to reproduce it, and what you expected.

| Kind | Send it to |
|---|---|
| A Brock bug, a missing Brock feature, an unclear migration or to-do | the Brock thread: `coord inbox send brock "<text>"` |
| A Tessera bug, a missing prop or part, a wrong rename | the Tessera thread: `coord inbox send foundations "<text>"` |
| Something the app built that other apps would need | the thread that should own it, marked "should be shared" |
| An improvement to an existing feature, or a flaw found while using it | the owning thread, marked "enhancement" |

Do not patch Brock or Tessera code inside the app, and do not fork their components. When you need a workaround to keep going, keep it small, leave a to-do that names the report, and remove it when the fix ships.
