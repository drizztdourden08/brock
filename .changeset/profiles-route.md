---
"@drizztdourden08/brock-core": minor
"@drizztdourden08/brock-react": minor
---

The app names its profiles route, and a bucket can open without a profile. `product.profilesRoute` (for example `'data/profiles'`, a hub page) makes every way to the profiles screen land there: the Profiles menu entry, the `profiles` boot task (no profile, an unknown pinned profile, several profiles and no last one), deleting the active profile through `useProfiles` and `open('profiles')`. Brock's own `profiles` screen is then not registered, and `ProfilesScreen` closes the hub after a pick on that route. Unset, nothing changes. `requiresProfile: false` on a bucket in `screens.config.ts` (or a `defineHub` def) lets its hub open while no profile is active, so a first run can reach that page to create a profile.
