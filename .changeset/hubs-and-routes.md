---
'@drizztdourden08/brock-react': minor
---

Hubs and routes grow three things an app can use. A bucket can set `header: { render(ctx), actions?(ctx) }`, drawn in the hub header row in place of the profile subtitle, with the hub render context and an area for actions on the right. A bucket can set `params: ['subject']`, a list of route params that stay when the page changes inside the hub, come back with Back and a restored session, and show up as `ctx.params` in every `when` rule (`ShowContext` has a new `params` field, so a hand-made context needs `params: {}`). `nav: 'rail'` draws the hub nav as an icon rail with no search. `ScreensConfig.aliases` maps an old route name to a new one, deep links included, and the Settings menu entry, palette breadcrumb and review tour now read the title of the settings bucket.
