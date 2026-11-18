---
'@drizztdourden08/brock-build': minor
---

`brock sync` writes the locale files from `src/locales/<tag>/<namespace>.json` and the `brock.locales` of installed modules: `.brock/locales.ts`, one lazy chunk per other language, `.brock/locales.main.ts` and the typed `.brock/messages.type.ts`. `brock check` reports drift, `brock structure` checks the locale folders, the `i18n` module id is registered, the screens literal reader accepts `msg('ns:key')` for tour titles, and electron-builder ships only the offered languages.
