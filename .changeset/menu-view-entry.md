---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

The View sub-menu now takes the whole menu config, not just a label. In `product.menu.entries.view`, `hidden: true` or `inMenu: false` leaves View out of the menu, and `group`, `order`, `before` and `after` place it like any other entry. Other entries can also be placed before or after `view`. Brock works out View's group and index from the effective menu and passes them to Tessera 0.37.2's `WindowTitleBar` `view` option. Left untouched or only renamed, View stays where it was. View still can't take a `parent`.

On a narrow window, the title bar tucks its pin and full screen buttons away into View. With View hidden, Brock adds Pin on top (`window-pin`) and Full screen (`window-fullscreen`) to the menu in View's place while a button is tucked away. They can be renamed, moved or hidden like any entry. The bar button and the menu entry share one pin state.

`brock check` no longer rejects a placed or hidden View. It still reports a `parent` on `view`. It warns, without failing, when `view`, `window-pin` and `window-fullscreen` are all out of the menu. The review no longer expects a View sub-menu when the config hides it, and checks a moved View between its neighbours. brock-react's Tessera peer range is `^0.37.2`.
