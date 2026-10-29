---
"@drizztdourden08/brock-electron": patch
---

Sigstore and TUF signature checks work in the Electron main process again. Electron has no default digest for EC keys, so `crypto.verify(null, ...)` failed there while it works in Node. Brock now gives that call the SHA-256 digest OpenSSL would pick, for P-256, P-384 and P-521 keys only; every other call goes through untouched. Turn it off with the `ecNullDigestShim: false` bootstrap option or `BROCK_NO_EC_DIGEST_SHIM=1`.
