---
'@drizztdourden08/brock-react': minor
---

The command registry can say why a command is unavailable and can be driven by an assistant. A command gains `reason()` (why it is off right now) and `meta` (plain app data, such as an args schema, returned by `commands.list()`), and `run` may return a promise. New `commands.describe(id)` returns `{ enabled, reason, checked }` with the gates applied. `commands.run` now returns a promise of `{ ok: true }` or `{ ok: false, why: 'unknown' | 'disabled' | 'gated', reason }` and waits for a promise from `run`; it used to return a boolean, so a caller that read the result must read `.ok` after awaiting. `CommandTrigger` gains `'assistant'`. A command with a `reason` shows greyed out in menus.
