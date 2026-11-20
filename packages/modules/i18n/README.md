<!-- @layer docs @kind doc -->
# brock-i18n

The language choice for an app that ships more than one language: system detection, the stored app and profile choice, and a Language tab for the settings hub. The runtime itself (`msg`, `Text`, the catalogs, the fallback chain) lives in `brock-core/i18n`, `brock-react` and `brock-electron`, so an app with English only needs no module.

## Install

```sh
brock add i18n
```

`brock sync` imports the module on all three sides. The preload adds `window.api.i18n`:

```ts
window.api.i18n.get()                // { locale, preference, system, offered }
window.api.i18n.set(preference)      // a tag, or null to follow the system
window.api.i18n.onChanged((state) => ...)
```

`offered` lists the tags the app ships. `locale` is the language in use, `system` the offered tag the system languages resolve to, and `preference` what the user picked (`null` follows the system).

## How the choice is made

| Level | Stored in | Drives |
|---|---|---|
| App | `app.json`, key `locale` | The splash, the tray, the profile picker and the default for every profile |
| Profile | The profile settings, key `locale` | The renderer while that profile is active |

Main reads the app choice before the app is ready, negotiates it against `app.getPreferredSystemLanguages()` and the offered tags, adds `--lang=<tag>` to Chromium and sets `ctx.i18n` before the splash shows. `i18n:set` writes `app.json`, switches `ctx.i18n` and tells every window with `i18n:changed`.

A profile may set its own language. Switching to that profile switches the language with no reload, and clearing the value (the "Same as the app" option) falls back to the app choice. A value that is not an offered tag counts as cleared.

## Language tab

The tab id is `language`, in the App group. It holds two searchable selects:

| Row | Options | Stored in |
|---|---|---|
| `appLocale` | "Match the system", then every offered tag by its own name | `app.json` through `i18n:set` |
| `locale` | "Same as the app", then every offered tag by its own name | The profile settings |

Each row's keywords hold every language's own name, so a user in a foreign interface finds the row by typing the name of their language. The tab text is in `src/locales/en/i18n.json`. Brock ships English only; an app translates the `i18n` namespace like any other.

## Web and Capacitor

With no preload bridge the module uses `navigator.languages` and `localStorage`, through the same `I18nApi`. The page does not know the offered tags, so the app tells it once, before the first render:

```ts
import { provideWebLocales } from '@drizztdourden08/brock-i18n/renderer';
import { appLocales } from '../.brock/locales';

provideWebLocales(appLocales);
```

## Renderer exports

| Export | Holds |
|---|---|
| `i18nRenderer` | The `RendererModule`: the locale source, the tab, the provider and the English table |
| `localeSource` | The `LocaleSource` given to `BrockApp` through `RendererModule.i18n` |
| `i18nApi()` | The host or web `I18nApi` |
| `provideWebLocales(locales)` | The offered tags for the web and Capacitor hosts |

## Wiring

`brock sync` writes `.brock/locales.ts` and `.brock/locales.main.ts` from `src/locales`. The app hands them over once on each side.

```ts
import { mainLocales } from '../.brock/locales.main';
bootstrapApp({ /* ... */ locales: mainLocales });
```

```tsx
import { appLocales } from '../.brock/locales';
<BrockApp locales={appLocales} /* ... */ />
```

Main builds its catalog from `mainLocales`, installs it with `installMainI18n` and reads the offered tags back through `offeredLocales()`, which is the `offered` list of `window.api.i18n.get()`. The module's own text is the `i18n` namespace, a `module` layer, so an app layer with the same key wins. Brock ships English only: an app that offers French translates Brock's namespaces in its own `src/locales/fr/` (see docs/architecture.md, Translation).

## Adding a language

```sh
brock i18n add fr            # empty namespace files in src/locales/fr
brock i18n todo fr           # the missing messages in todo.fr.json
brock i18n merge todo.fr.json
brock i18n check             # every tag; --locale fr for one
brock i18n coverage          # the translated share per tag
brock sync                   # regenerate .brock/locales*.ts
```

Tags are BCP 47 (`fr`, `pt-BR`). The base folder (`en` unless `moduleOptions.i18n.base` says otherwise) holds every key. A tag listed in `moduleOptions.i18n.draft` stays out of the offered list while it is unfinished. `brock gate` runs `brock i18n check` whenever `src/locales` exists. Translate the module's own `i18n` namespace too, so the Language tab reads in the new language.
