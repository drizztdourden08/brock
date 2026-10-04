---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-lint-config': minor
---

A tab page takes its meta from `<page>.page.ts` beside its folder: a file that exports only `meta: ScreenMeta` (title, icon, order, shortcut, devOnly, keywords). The screen sync writes it as a `page-meta` entry, the nav and the search index name and place the page with it, and `brock structure` names a `.page.ts` with no tab folder beside it or no `meta` export.
