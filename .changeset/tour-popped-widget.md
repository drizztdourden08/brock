---
'@drizztdourden08/brock-react': patch
'@drizztdourden08/brock-core': patch
'@drizztdourden08/brock-electron': patch
---

A tour step whose lit part is a widget popped into its own window lights it there: the main window relays the step's spot to the widget window, which draws Tessera's `TourSpot` over the widget, while the bubble stays in the main window. Before, the bubble sat in the middle and nothing was lit. The review lights a popped widget from a tour step and checks the widget window draws the spot and drops it when the tour closes (`reviewWidgetProbe({ kind: 'tourSpot', id })`).
