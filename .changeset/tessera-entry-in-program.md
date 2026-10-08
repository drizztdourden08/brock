---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/create-brock': patch
---

`brock sync` writes `.brock/tessera.ts`, a type import of the Tessera entry module, in every app that has Tessera. A `declare module '@drizztdourden08/tessera'` block, such as the parts module `tessera guide` writes, only resolves when the Tessera entry file is already in the program, and an app whose own files import Tessera through subpaths never loaded it; in an app scaffolded with `--local`, where the Brock packages are links that import their own Tessera copy, `tsc` and `pnpm lint` failed with TS2664 ("Invalid module name in augmentation") as soon as the guide wrote any part. A fresh app ships the file, and the next `brock sync` adds it to an existing one.
