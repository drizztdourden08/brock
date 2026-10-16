---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-react': minor
---

`pickFile({ anyType })` takes a host or form factor (`'mobile'`, `'desktop'`, `'electron'`, `'capacitor'`, `'web'`) or a map of them such as `{ mobile: true }`, and drops the type filter only there, so a phone opens the picker unfiltered while the Electron picker keeps its filter. A host key wins over the form factor key. `true` still drops it on every host. `anyTypeFor(anyType, info)` from brock-core resolves the value.
