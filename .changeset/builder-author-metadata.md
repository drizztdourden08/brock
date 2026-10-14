---
'@drizztdourden08/brock-build': patch
---

The managed electron-builder config puts `author` (`{ name, email }` from `product.author`) into `extraMetadata` beside `homepage`, so an app's `package.json` need not repeat it.
