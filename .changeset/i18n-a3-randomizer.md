---
'@drizztdourden08/brock-randomizer': minor
'@drizztdourden08/brock-react': patch
---

The randomizer module has its own `randomizer` translation namespace. Option tab, option label, hint, description and choice labels, the options aside label, run panel titles, the missing art notice, tracker badges, assumptions and facet labels, the Archipelago start check, and the page, bucket, mode and widget labels are all `Text` and are resolved where they are drawn. `ChecksWidgetViews` and the inventory slot take an optional `label`. `ProfileModeDef.label` is a `Text`. The Archipelago world export stays English: `ApOptionDef.displayName` and `description` take `Text` and are written as plain strings.
