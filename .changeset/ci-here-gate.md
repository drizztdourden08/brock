---
'@drizztdourden08/brock-thread': minor
---

Add `brock ci --here`, a cheap gate for `pr merge --local`. It runs the planned steps in the current checkout, skips the install, and needs HEAD to be the commit under test with a clean tracked tree. The record carries `place: 'here'`, and `--here`, `--localpkg` and `--no-cache` no longer take the next word as a value.
