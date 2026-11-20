---
'@drizztdourden08/brock-port-kit': minor
'@drizztdourden08/brock-react': patch
'@drizztdourden08/brock-core': minor
---

An asset step report takes a `Text` for its line, so `report.line(msg('ns:key'))` shows in the active language. Brock React typechecks when the app's generated messages type narrows the keys: `isMessageKey` narrows the tour and Tessera keys read at run time.
