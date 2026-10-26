---
'@drizztdourden08/brock-react': patch
---

Brock's own screen scrollers keep a stable scrollbar gutter. The page body, the info card, a hub with no nav, a plain hub page and the release notes panel now reserve the scrollbar width all the time, so content no longer reflows (and a lobby no longer flips between one and two columns) when the scrollbar comes and goes.
