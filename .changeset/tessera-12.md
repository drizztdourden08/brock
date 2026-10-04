---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
---

Brock moves to Tessera 0.12.0 (brock-react's peer is `^0.12.0`). A widget window now draws Tessera's own pin menu in its title bar and Tessera's Pin row in its options panel, in place of Brock's `WidgetPinMenu` and the Stacking row; the pin stays off or on top, sync stays a separate option, and a saved `with-app` pin still opens as off with sync on. The `widget:popped` event carries the new `PoppedWidgetPatch`, whose pin is never `with-app`. The review reads the page header through the `content-header` classes.
