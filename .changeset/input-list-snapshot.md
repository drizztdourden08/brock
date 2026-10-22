---
'@drizztdourden08/brock-input': patch
---

`input.list()` returns the cached device snapshot again and no longer runs a full HID scan on every call. An app that polled it could drop a pad that was in use. The scan moves to a new `input.refresh()` verb (`input:refresh`) meant for a user action, never a timer.
