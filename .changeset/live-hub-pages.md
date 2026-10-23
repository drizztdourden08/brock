---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-lint-config': minor
---

Live hub pages. A `<id>.live.tsx` file in a bucket or group folder is a slot in the hub nav that fills at runtime. It default-exports a hook that returns `LivePage[]` (`key`, `title`, `icon`, `badge` of `'ok'` or `'warn'`, `render`) and exports `meta: LiveMeta` (`icon`, `empty`, `title`, `order`, `keywords`, `devOnly`). The slot sorts by `meta.order` among the static pages, so Directory, one entry per connected pad, then Logs and Diagnostics keep their order. The badge shows as a status dot on Tessera's `SideNavItem`, `empty` shows as a disabled nav entry while the list is empty, and `keywords` feed the hub search. An entry opens at `<bucket>/<id>/<key>` (`section` and `tab`); when it disappears, the hub shows the first static page of the group. `brock sync` reads the file as an eager kind, and `brock-lint-config` treats it as a screen file. See Live hub pages in `docs/app-structure.md`.
