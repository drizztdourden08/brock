---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

Breaking: hub pages draw no big page header by default, and the app can take over the content side of a hub. A page shows the header only with `showHeader: true` in its meta (a page that declares `header: { primary, search }` keeps it, a page with tabs keeps its tab bar, a sub page keeps its back button); a page that fills the header with `PageActions` needs `showHeader: true`. Migration `hub-page-header-off` (0.80.0) lists each hub page and custom page without a header setting as a to-do. New: `bare: true` in the meta of a `.page.tsx`, `.custom.tsx`, `<page>.page.ts` or `.live.tsx`, or on a `LivePage` entry, renders the page straight into the content slot with no card, padding, header or scroll area, named by the page title for assistive tech. `pages: 'bare'` on a bucket (or `HubDef`) makes every page of the hub bare, and a page opts back in with `bare: false`. `WindowItem` takes `bare: true` to drop the pane scroll area of one `defineWindow` item. `HubPagesMode` is exported.
