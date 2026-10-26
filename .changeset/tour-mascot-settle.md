---
'@drizztdourden08/brock-react': patch
---

The review tours wait for the walking mascot to stop before they check that it keeps off the lit part. The wait reads the mascot's position until it holds still for a few polls, up to 3 seconds, and the step fails with the reason when it never stops. It replaces the single fixed 700 ms pause, which a long walk to a page-sized hole outlasted.
