---
'@drizztdourden08/brock-input': patch
---

The Controllers hub keeps each pad in its Connected list while the Diagnostics wizard has the pads released. Before, the list showed "No controllers" for the whole capture. Each pad stays listed with " (in diagnostics)" after its name until the hold returns, then the live list shows again. `padLivePages` takes an optional second argument that adds the same mark. The wizard text now says what the pause means for the player ("Your controllers are paused in the app while the capture runs.") in place of "Controllers released." and the other release and hold wording.
