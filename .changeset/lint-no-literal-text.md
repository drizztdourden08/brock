---
'@drizztdourden08/brock-lint-config': minor
---

New rule `brock/no-literal-text`, off by default. It reports literal user-visible text in JSX text, text attributes and label properties, so an app that translates its text can turn it on with one `extra` entry and keep every string in the locale table. Options: `attributes`, `properties` and `ignore`. The lint-config README shows how to turn it on.
