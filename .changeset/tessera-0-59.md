---
'@drizztdourden08/brock-react': minor
---

Brock is now built and tested on Tessera `^0.59.0` (the workspace catalog). `brock-react` now takes any Tessera from `>=0.58.0 <1` as its peer, so a consumer can move to a newer Tessera minor without waiting for a Brock release. Brock is tested on the catalog version only. The release adds VirtualGrid sections, a scroll ref and marquee select, and a `.bxel` file icon. It has no MIGRATION entry, and Brock needed no code change for it.
