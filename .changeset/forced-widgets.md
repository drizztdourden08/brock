---
'@drizztdourden08/brock-react': minor
---

`widgets.force(ids)` forces widgets open, for command line baselines and end-to-end runs on a fresh profile. Each id opens (a kit widget opens its kit), at once or as soon as its definition is registered, and again after each profile loads. A forced widget skips the context gate and the developer tools gate, docked, floating and popped, and a forced kit widget lets its kit past the kit's `devOnly` and `requires` gates. The list replaces the previous one, and `widgets.force([])` ends forcing. An app reads its own flag, such as a `--widgets=` argument, and passes the ids. The review checks a forced kit widget past its gate (`kit-forced-opens`, `kit-forced-released`).
