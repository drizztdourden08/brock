---
'@drizztdourden08/brock-thread': patch
'@drizztdourden08/brock-build': patch
'@drizztdourden08/create-brock': patch
---

Catalog ranges that YAML cannot read plain are now quoted. `brock upgrade` wrote `>=0.58.0 <1` as the Tessera catalog value, and pnpm then failed on the app's `pnpm-workspace.yaml` with a line break error. The upgrade, `mergeCatalog` and the scaffolder now share one helper, `yamlScalar`, that quotes a value only when it needs it (`^1.2.3` stays plain). The catalog readers strip the quotes, so a quoted value round-trips. Upgrading from a Brock checkout now sets the Tessera catalog to the version that checkout is tested on, not to the wider peer range.
