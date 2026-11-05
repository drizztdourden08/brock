---
"@drizztdourden08/brock-randomizer": minor
---

The options step and the Options page now share one options panel with a tab per section (or per `views.optionTabs` entry), a changed count on each tab and an optional `views.optionsAside`. A tab can bring its own `Body`. `views.connection[mode]` replaces the connection step body for a mode. `RollContext` gains `onProgress`, surfaced as `useRollProgress`. New exports `useOptionTab` and `randomizerReviewSections` serve an app's own wizard review. `views.optionsStep` and `views.optionSubSteps` are deprecated in favour of `optionTabs`.
