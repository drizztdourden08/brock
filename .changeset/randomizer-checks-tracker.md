---
"@drizztdourden08/brock-randomizer": minor
---

The checks tracker is generalized. A game fills it through optional `TrackerProvider` hooks: `artOf`, `facets`, `facetsOf`, `kindOf`, `badgesOf` and `statusesOf`, and `TrackerGrouping` takes a `description`. The checks view gains summary counts, status, kind and tag filters, and compact, detailed and card layouts. It shows a placeholder when `artOf` returns null. The spoiler page uses the same view. A game that sets the new optional `inventory` provider (`InventoryProvider`, layouts of areas, rows and tiered slots) gets an inventory widget. A game without it carries no inventory widget.
