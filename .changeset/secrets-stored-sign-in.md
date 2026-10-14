---
'@drizztdourden08/brock-secrets': minor
---

`useSignIn` starts signed in when a token is stored. A sign-in provider names the secret its token goes to with `tokenSecret`, or answers itself with `isSignedIn()`; `window.api.secrets.signIn.signedIn()` returns each provider's state, and the module's renderer boot task reads it before the window shows, so a screen no longer draws the signed-out state first. `useSignInStore` adds `loaded` and `loadSignedIn()`.
