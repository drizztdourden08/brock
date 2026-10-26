---
'@drizztdourden08/brock-react': patch
---

Brock builds on Tessera 0.67. A widget's `dockWeight` now reaches Tessera, so docked widgets that share an edge are sized by weight, every widget keeps its weight when another one joins, and `defaultDockedSize` resizes the column a widget joins. This covers a widget opened from the Widgets menu, a widget kit member, a layout preset and a widget docked back from its own window. A widget's `icon` is now an icon name, and Tessera draws it before the label in the widget title bar and the tab chip, also in a popped widget window. A docked toolbar's `slot` carries `menuSide`, which an app can pass to Tessera's `Toolbar` so a left bar opens its menus to the right. The corner handles between stacked widgets no longer cover the title bar buttons of the widget below.

The app review expects the widget title bar buttons at the larger of the xs height and Tessera's minimum hit area, which is 24 px since Tessera 0.67.
