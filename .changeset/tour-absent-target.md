---
'@drizztdourden08/brock-react': patch
---

A tour step whose target is absent shows its bubble centred, and now counts as shown: the review reports `<step>-centred` instead of failing `<step>-lit`, and goes on with Next. A click step (`advanceOn: { click }`) whose click target is absent too gets a Next button, so the user and the review are no longer stuck on it.
