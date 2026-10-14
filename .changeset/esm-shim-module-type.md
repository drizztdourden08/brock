---
'@drizztdourden08/brock-build': patch
---

A main or preload chunk with an import line inside a template literal builds as written: electron-vite put its CommonJS shim inside the literal, and Brock now moves it after the last import statement. `brock check` fails, and `brock sync` warns, while the app's `package.json` lacks `"type": "module"`, which the managed configs need for `import.meta.dirname`.
