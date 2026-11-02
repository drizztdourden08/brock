---
'@drizztdourden08/brock-input': patch
---

Apply the saved stick calibration and its dead zone to every controller report, as the triggers already were. A stick is centred, scaled to its recorded range, zeroed inside the inner dead zone and rescaled radially up to the outer one. The unprocessed stick values ride along as `rawSticks`, which the stick calibration wizard reads. Also clear the held buttons, d-pad directions and axes of every pad when the gamepad subsystem is released or restored for a capture, so nothing stays pressed across the release or lets go later.

Also fix `useHoldReleased`, which read the capture hold backwards: the addon reports `held` as true while the gamepads are released, so the hook now reads released then and the Controllers hub keeps the last known devices during a capture.
