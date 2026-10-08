---
'@drizztdourden08/brock-display': patch
---

Display accepts koffi 3. The `koffi` peer range is now `^2.9.0 || ^3.0.0`, so an app already on koffi 3 keeps it. Nothing in the driver changed: it declares `DEVMODEW` and the C prototypes and calls them, which koffi 3 kept, and the macOS driver only passes its pointers back and checks them for null, which holds for koffi 3's BigInt pointers. A new test runs the Windows driver on koffi 3 and the same declarations on koffi 2: struct size, the current mode read in place, the rate list, and a `CDS_TEST` mode change.
