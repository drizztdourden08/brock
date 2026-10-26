---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-core': minor
---

Add `product.menu.profiles`, true by default. With `false` the Profiles entry leaves the main menu, as `product.menu.home: false` does for Home. Profiles themselves keep working: the profile switcher, the command palette and the shortcuts are unchanged. The review does not expect the Profiles entry then.

Add `product.initialProfile`, a profile name such as `Default`. On the first start, when no profile exists, the `profiles` boot task creates a profile with that name and activates it without opening the profile picker. The Profiles screen and switching stay available, unlike `singleProfile`. With a profile already on disk nothing changes.
