---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-build': minor
---

Breaking: require Tessera 0.52.0, which drops light backgrounds. `product.icons.rim` takes `'light'` only, and `brock icons` no longer reads `brand/dark-rim`. The hero brand art and the About screen follow the new Tessera types. Apps remove `rim: 'dark'` and any `ground` prop on `BrandMark` or `Logo`; migration `light-ground-removed` lists each one as a to-do.
