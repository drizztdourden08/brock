---
'@drizztdourden08/brock-react': minor
---

A page, a tab page (through `<page>.page.ts`) or a sub page can set `meta.fill: true`: the page takes the window height and its body does not scroll, so a `ListDetail` or `ListDetailLayout` inside it scrolls its list and its editor on their own, and a long editor no longer scrolls the list out of view.
