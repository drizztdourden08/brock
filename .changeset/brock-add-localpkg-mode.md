---
'@drizztdourden08/brock-build': patch
---

`brock add` works in localpkg mode. When the app or its workspace root holds a localpkg `.pnpmfile.cjs`, a `@drizztdourden08/*` module or peer is written into `package.json` as `^<version>` from the localpkg index and installed with `pnpm install --no-frozen-lockfile`, instead of `pnpm add`, which failed with ECONNREFUSED on the guarded scope registry. A package missing from the index fails with a note to run `localpkg publish <producer>`.
