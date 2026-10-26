---
'@drizztdourden08/brock-react': patch
---

Brock builds on Tessera 0.66. A widget's `dockWeight` now reaches Tessera, so docked widgets that share an edge are sized by weight, every widget keeps its weight when another one joins, and `defaultDockedSize` resizes the column a widget joins. This covers a widget opened from the Widgets menu, a widget kit member, a layout preset and a widget docked back from its own window. `WidgetDef` takes `dockWeight` from Tessera's `WidgetDefinition`.
