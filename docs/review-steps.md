<!-- @layer docs @kind doc -->
# The app's own review: seed and steps

The built-in review tours the shell. An app adds two things so the tour also sees its real content: a seed that fills the app with data before the screens are captured, and steps that drive its own flows. Both are plain files in `src/review/`, picked up by `brock sync`, and both write into the same `report.json` and `report.md` as the built-in steps.

| File | Runs | Step name in the report |
|---|---|---|
| `src/review/seed.ts` | right after the profile step, before the menu, screens, widgets and search | `seed` |
| `src/review/<id>.step.ts` | after every built-in step, in file name order | `<id>` |

`brock sync` writes `.brock/review.ts` with a lazy import of each file, and `src/main.tsx` passes it on as `<BrockApp review={appReview} />`. The files load only on a review launch, in the review's own chunk, so a normal launch never downloads them. `<id>` is kebab-case; an id that is the name of a built-in step (`boot`, `menu`, `screens`, ...) fails with a `step-id` check, and `seed` is reserved for the seed.

## The seed

```ts
// src/review/seed.ts
import { channelApi, defineReviewSeed } from '@drizztdourden08/brock-react';
import { APP_CHANNELS } from '../ipc/contract.constants';
import { REVIEW_SESSION } from './review.constants';

export default defineReviewSeed({
  run: async (tour) => {
    const api = channelApi(APP_CHANNELS);
    const preset = await api.presetsCreate({ game: 'Clique', name: 'Review preset', values: {} });
    await tour.platform.files.writeText('sessions/review.json', JSON.stringify(REVIEW_SESSION));
    tour.check('preset-seeded', preset.id.length > 0, 'a preset exists for the dashboard', 'the preset was not created');
  },
});
```

The seed runs once the review profile is active, so whatever it writes lands in that profile. It can fill the app three ways, and mix them:

- Through the app's own channels (`channelApi(APP_CHANNELS)`, or `tour.api` for Brock's), so main creates the data the way the app does. This is the closest to a real user.
- Through a store (`useWidgetPrefStore.getState().setPref(...)`, an app zustand store), for state that lives in the renderer.
- As a fixture: `tour.platform.files` writes files under the profile's `Data/` folder (`writeText`, `writeBytes`, `mkdir`). A main service that reads its files on each call sees them at once; one that loaded them at boot needs a channel that reloads.

A seed is a review step like the others: its checks and captures go in the report under `seed`, and a seed that throws fails a `step-ran` check without stopping the tour.

## A step

```ts
// src/review/sessions.step.ts
import { defineReviewStep } from '@drizztdourden08/brock-react';

export default defineReviewStep({
  run: async (tour) => {
    await tour.openScreen('sessions');
    const rows = await tour.waitFor(() => tour.findAll('.session-row').length || null);
    tour.check('sessions-listed', rows !== null, `${rows} session(s) listed`, 'the sessions screen listed no session');
    await tour.capture('list');
    const first = tour.find('.session-row button');
    if (first) tour.click(first);
    await tour.capture('detail');
  },
});
```

`capture('list')` in the step `sessions` writes `NN-sessions-list.png`. Each check id is reported with the step name, so ids only need to be unique inside a step. A step that finishes gets a passing `step-ran` check; one that throws gets a failing one, and the tour resets the UI (closes menus, dialogs and screens) before the next step either way.

## The tour helpers

`run(tour)` gets the same tour the built-in steps use, plus the DOM helpers they call:

| Helper | What it does |
|---|---|
| `check(id, pass, passReason, failReason)` | records one check |
| `report(outcomes)` | records several `{ id, pass, reason }` at once |
| `capture(name)` | waits for the page to settle, then asks main for a PNG, named `<step>-<name>` |
| `find(selector, root?)`, `findAll(selector, root?)` | `querySelector` and `querySelectorAll` as `HTMLElement` |
| `click(element)` | mouse down, mouse up and click, as a user would |
| `hover(element)` | a mouseover |
| `typeText(input, text)` | sets an input or textarea the way React sees typing |
| `press({ key, ctrlKey? })` | a key down and up on the focused element |
| `waitFor(probe, timeoutMs?)` | polls until `probe()` is truthy (3 s by default), else `null` |
| `settle()` | two frames and a short pause, for transitions |
| `delay(ms)` | a plain wait |
| `openScreen(id)` | opens a screen through its menu entry, else `nav.open` |
| `openWidget(id)` | opens a widget and waits until it is drawn |
| `resetUi()` | closes the menu, the palette, dialogs and the open screen |
| `env` | the product, the home screen, the registered screens, the menu, the module ids |
| `platform`, `api` | the platform ports and `window.api` |
| `id` | the step's own name |

Main's watchdog ends the review when nothing is captured or checked for 30 s, so a long seed reports a check between slow calls.

## In a fresh app

`create-brock` ships `src/review/seed.ts`, which writes a note into the Notes widget, and `src/review/notes.step.ts`, which opens the widget, checks the note shows and captures it. The built-in `app-widgets` step then also captures the widget with its note.
