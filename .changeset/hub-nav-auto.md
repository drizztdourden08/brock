---
"@drizztdourden08/brock-react": minor
---

One menu per hub, and only when it helps. A bucket in `screens.config.ts` (or a `defineHub` def) takes `nav: 'auto' | 'always' | false`, `'auto'` by default: the hub draws its side nav only while two pages or more are shown, and with one page shown it draws that page alone, with no side nav and no hub search field. The nav comes back as soon as a `when` rule, a host rule or developer tools show a second page. `'always'` keeps the old look for one page, and `false` never draws the nav. Back, the history and Escape (up to the hub home, then closed) work the same without the nav. The review's hub checks pass a hub with no nav: `<hub>-pages` checks that no nav is drawn, each page opens with `open` instead of its nav entry, and the hub search runs in the first hub that has one.
