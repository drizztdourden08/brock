---
'@drizztdourden08/brock-electron': patch
---

Fix the Electron EC null-digest shim so it applies to a public `KeyObject`. It called `createPublicKey` on a key that was already public, which threw and left no digest picked, so Sigstore verify still failed in Electron. A bare `KeyObject` and `{ key: KeyObject }` now pass through as they are, and a private key is still turned into its public key.
