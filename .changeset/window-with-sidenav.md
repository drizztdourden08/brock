---
'@drizztdourden08/brock-react': minor
---

Add `defineWindow`, a declarative window with a side nav and one pane per nav item: nav groups and items (label, icon, id, disabled, badge) with their content in a `.card.tsx` or `.layer.tsx` file, the active item from the `nav` route param, and the nav folding to a bar in a narrow window. A card with `fill: true` in its meta now draws the one window header and a body with no padding or scroll wrapper. The Tessera minimum is now 0.48.0, which draws the nav item badge.
