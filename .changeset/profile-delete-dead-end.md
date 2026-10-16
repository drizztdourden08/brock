---
'@drizztdourden08/brock-react': patch
---

Deleting the active profile no longer leaves a blank window where Escape and Home do nothing. When other profiles remain, the most recently used one becomes active and the user stays on the screen they are on; only when the last profile goes does the app open the profiles route (`product.profilesRoute` when set, else the `profiles` screen). Deleting a profile that is not active changes neither the active profile nor the screen. With no active profile and a home screen that needs one, Escape with nothing open opens the profiles route, Escape on that route keeps it open instead of closing it to an empty window, and the Home menu entry shows as disabled with the reason, Pick or create a profile first.
