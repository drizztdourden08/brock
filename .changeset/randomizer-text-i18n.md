---
'@drizztdourden08/brock-randomizer': minor
'@drizztdourden08/brock-react': patch
---

The randomizer module's remaining visible English text takes `Text` and lives in `locales/en/randomizer.json`: the run view, the network view and pill, the lobby setup, the profile tab facts, the wizard step, the connection fields and the extra pages empty message. The facts and row helpers of the profile tab take a trailing `text` resolver, `RandomizerLabels.counters` is `Record<string, Text>`, and `LiveMeta.empty` accepts a `Text`.
