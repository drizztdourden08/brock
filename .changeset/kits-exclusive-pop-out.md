---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/create-brock': minor
---

Widget kits are exclusive, and kit widgets can pop out. Brock moves to Tessera 0.38.0.

One kit is open at a time: opening a kit closes the open one first, with its popped windows. While a kit is open, the normal widget entries and Reset layout in the menu stay enabled. Opening a normal widget, from the menu, a shortcut, `widgets.open`, `widgets.toggle` or `widgets.popOut`, closes the kit first and brings the normal layout back with that widget open. Reset layout closes the kit too. The normal widgets still step aside while a kit is open.

The widgets API now reaches kit widgets. `widgets.open(id)` on a kit widget, and the new `widgetKits.openWidget(id)`, open its kit, closing any other, and show the widget even if the user had closed it in the kit layout. A widget already shown stays as it is, so a list of ids opened one by one, such as an app's startup flag, opens them all. `widgets.toggle`, `widgets.close`, `widgets.popOut` and `widgets.isVisible` work on kit widgets the same way. Before, `widgets.open` on a kit widget did nothing.

A kit widget with `popOut` pops out into its own window like a normal widget, and the window belongs to the kit layout. Closing the kit by any route closes its windows, and reopening the kit brings them back popped or docked as they were left. Saved kit layouts now keep their popped widgets, per profile. Each kit widget gets its kit id as its Tessera `group`, so it never tabs or splits with a widget of another group, and a popped kit widget dragged back over the app is offered only to its kit.

From Tessera 0.38.0: a widget's `chrome` (`full`, `compact` or `none`) is a widget meta field (`meta.chrome`, checked by `brock structure`). It applies docked, floating and popped. Floating widgets snap to the stage edges, the main view and each other (`floatSnap`, 10 px). The template's Layout inspector widgets use `chrome: 'compact'`.

The review's `kits` step covers one kit at a time, a normal widget closing the kit from the menu and the API, `widgets.open` opening a kit widget's kit, the compact chrome, and a kit widget popping out, closing with the kit and coming back when it reopens.

The review's bug report step moves the pointer off the title bar button after its click: with Tessera 0.38 a press shows the button's hint, which takes the first Escape.
