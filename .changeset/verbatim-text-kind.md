---
'@drizztdourden08/brock-lint-config': minor
'@drizztdourden08/brock-build': minor
---

A new file kind for text reproduced word for word from an outside source, which the app must show exactly as it is (a licence text, a game's own dialogue table, the strings a protocol defines): `/* @layer <layer> @kind verbatim @source <short text> */`. A verbatim file gets everything `@kind data` gets (no 200-line cap, several exports, `UPPER_SNAKE` consts, and `brock/data-only` keeps it to data), and in addition the dash, punctuation and prose rules skip its string values through the standards `verbatimText` option, with the source as the `why`. Identifiers, comments, the header and vendor names are still checked, and an ordinary `@kind data` file keeps every prose rule. The new `brock/verbatim-source` rule fails a verbatim header without `@source`, and `brock structure` lists every verbatim file with its source so a review sees what is exempt. `@drizztdourden08/brock-lint-config/data-files` exports the list. Needs `@drizztdourden08/standards` 0.10. See `docs/app-structure.md`.
