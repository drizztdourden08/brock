---
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

The bug report falls back to a GitHub issue when the main transport cannot send. A main transport can declare `available(ctx)`; while it answers false, the dialog targets the prefilled issue on `product.repo` (else the clipboard) from the start. When a transport fails on send and the product has a `repo`, the error offers Open a GitHub issue instead, which opens the issue with the same title, text and diagnostics.
