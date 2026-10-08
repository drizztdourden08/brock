---
'@drizztdourden08/brock-build': patch
---

`brock package` never ships Electron's icon. It copies the brand icons before electron-builder on every platform and stops when the icon of this platform is missing. Linux takes `build/icons/linux/`, `<size>x<size>.png` files that electron-builder reads; it ignored the `icon-<size>.png` names of `build/icons/png/`, fell back to Electron's icon and crashed building the `.deb`.
