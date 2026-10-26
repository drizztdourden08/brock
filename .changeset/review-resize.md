---
'@drizztdourden08/brock-react': minor
---

An app review step can now set the window size. `defineReviewStep` takes `sizes`, a list of `'narrow'` (the 600 by 720 window the shell uses for its own narrow captures) or `{ name, width, height }`. The step runs once per size: the main window is resized through the review probe, which works in a hidden launch, the step runs, and the window goes back to its old size even when the step throws. The size name is added to the end of every capture and check id, so one step can capture a layout narrow and wide.
