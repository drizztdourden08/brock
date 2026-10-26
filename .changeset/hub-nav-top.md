---
'@drizztdourden08/brock-react': minor
---

A hub can fill the top group of its side nav. `top` on a bucket in `screens.config.ts`, or on a `defineHub` def, is a list of page ids that Brock passes to Tessera's SideNav as `config.top`: they sit under Home in that order with one divider after the block. A page in `top` leaves its regular group, and a group left with no page is not drawn. A hidden or unknown id is skipped. `buildHubNav` takes the list as a fourth argument.
