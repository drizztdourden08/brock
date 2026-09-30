---
"@drizztdourden08/create-brock": patch
"@drizztdourden08/brock-build": patch
"@drizztdourden08/brock-thread": patch
---

An app on another Windows drive than its linked Brock checkout keeps its links: `create-brock --local`, `brock add --local`, `brock adopt --local` and `upgrade --local` add `prefer-frozen-lockfile=false` to `.npmrc` (and `pnpm-lock.yaml text eol=lf` to `.gitattributes`) when a `link:` spec crosses drives, so later installs resolve the links instead of joining `X:/...` to the app folder.
