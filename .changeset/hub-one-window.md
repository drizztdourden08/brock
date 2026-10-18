---
'@drizztdourden08/brock-react': minor
---

Hub windows drop the Back button and share one window: one position, size and lock for every hub. The Back button and its row are gone; Escape, the hub switch, Alt+Left and the mouse Back button still go back. The save status and the profile tag now sit beside the hub switch and take no row. Every hub uses the storage key `brock.hub` and keeps one `ScreenWindow` mounted when you switch hubs, so the window stays where it is, at the same size and lock, whichever hub is shown. The per-hub keys of 0.64.0 (`brock.hub.<hubId>:rect` and `:locked`) are no longer read.
