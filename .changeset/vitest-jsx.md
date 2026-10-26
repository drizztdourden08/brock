---
'@drizztdourden08/brock-build': patch
---

An app test can import brock-react again. `@drizztdourden08/brock-build/vitest` exports `defineBrockVitestConfig`, which sets the automatic JSX runtime and compiles every `@drizztdourden08/*` package instead of loading it as is, and `brock sync` writes it as a managed `vitest.config.ts` for an app with a `test` script. A `vitest.config.ts` you wrote yourself is left alone; wrap it in the factory. Run `brock sync` after updating.
