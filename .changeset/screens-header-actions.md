---
'@drizztdourden08/brock-react': minor
---

Pages declare header actions: `meta.header` takes a primary button (`{ label, icon?, open }`, where `open` is a sub-page path or a route) and a filter field (`{ placeholder? }`, read with `usePageSearch()`), drawn in the standard page header beside the title and tabs. `<PageActions primary search>…</PageActions>` in a page body puts the same row there from props.
