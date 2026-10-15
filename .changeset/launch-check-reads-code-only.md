---
'@drizztdourden08/brock-build': patch
---

`launchAppForTest` and `assertLaunchable` no longer refuse a built main over a specifier that sits in text. The import check now tokenizes each built file and reads `import`, `export ... from`, `import()` and `require()` from the code only, so a `require('./package.json')` inside a string, template text, a comment or a regular expression (such as a workflow template bundled into main) is ignored.
