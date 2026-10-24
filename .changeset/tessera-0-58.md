---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

`brock-react` now requires Tessera `^0.58.0`. The release adds Bxel file type icons, a windowed VirtualGrid, DynamicInput character sets and validation, and Toolbar click menus. It has no MIGRATION entry, and Brock needed no code change for it. `brock icons` now reads the file type icons from the plain brand folder when the brand has a rim, because Tessera ships `filetypes/` only there. Before, a light rim brand such as Bxel with `rim: 'light'` got no file type icons.
