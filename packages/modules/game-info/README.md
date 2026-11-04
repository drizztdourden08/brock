<!-- @layer docs @kind doc -->
# brock-game-info

One game info widget shared by every game. The game supplies a provider: a snapshot reader, a list of sections and the signals of its core and its lock. The module polls the reader, diffs the blocks and draws them.

## The provider

| Field | Meaning |
|---|---|
| `core` | `state()` returns `{ status }`; `subscribe(fn)` fires on a change. |
| `gate` | `get()` returns a `WidgetDisabledState` while the widget is locked, `null` when open. |
| `read()` | The current snapshot, or `null` when the game has none. |
| `sections` | A `GameInfoSection` per `SectionId`: `blocks(snapshot)`, optional `compact(snapshot)`, optional `developer`. |
| `emptyText` | Shown while there is no snapshot. |

Section ids: `location`, `party`, `story`, `inventory`, `techs`, `music`, `raw`.

Blocks: `rows`, `members`, `list`, `progress` and `custom`. A row, list item or progress item can be marked `spoiler`.

## Use

```ts
import { provideGameInfo } from '@drizztdourden08/brock-game-info';

provideGameInfo({ core, gate, read, sections });
```

Calling it again replaces the provider.

## Widget prefs

| Key | Values | Default |
|---|---|---|
| `view` | `full`, `compact` | `full` |
| `refreshHz` | `1`, `4`, `10` (stored as a string) | `4` |
| `hexIds` | boolean | `false` |
| `hideSpoilers` | boolean | `true` |
| `sections` | list of section ids | all but `raw` |

## Store

`useGameInfoStore` holds `snapshotAt`, `blocks`, `compact`, `changed` and `running`, with `publish(next)`, `setRunning(on)` and `reset()`.
