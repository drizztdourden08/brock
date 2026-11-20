---
'@drizztdourden08/brock-react': minor
---

`I18nProvider` takes `document={false}` to leave the page `lang` and `dir` alone, so a nested provider for another language no longer overwrites the app's.
