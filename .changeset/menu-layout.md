---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-core': minor
---

Toolbars is now a level 1 menu next to Widgets, with the same key and contents. `product.menu.home: false` leaves the Home entry out of the menu. `<BrockApp titleBarMenu={{ label, icon }}>` puts the app's title bar items into one dropdown button, keeping chords, disabled state and the disabled reason inside it.

The built-in Logs and Performance widgets now sit in the Developer group of the Widgets menu while developer tools are on, and stay in the plain list while they are off. A widget meta takes `menu: { developer: true }` for the same behaviour.
