---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

Title bar items take `disabledReason` beside `disabled`, and a `status` spec takes both. Brock hands them to Tessera 0.53, which makes a disabled action inert and shows the reason as its tooltip. `brock-react` now requires Tessera `^0.53.0`. `disabledReason` is a literal a lazy title bar button can keep.

`SettingItem.hint` is optional. Tessera 0.53 draws a settings row with no hint line and no gap when the hint is missing or empty, and Brock hands the row `undefined` as it is. The settings search, the palette and the build-time seeds already treat a missing hint as no text. A linked toggle with no hint draws none.
