<!-- @layer docs @kind doc -->
# brock-catalog

A content catalogue client: the app's catalogue API behind its own endpoint and schema, installs that run as Brock jobs, the checks every download passes, uninstall, the installed record with its guard, and install links. What an item is and where it lands stays in the app, through its installers and hooks, so any app can use it for presets, themes, levels or any other content it lists.

## Install

```sh
brock add catalog
```

`brock sync` imports it on all three sides. The preload adds `window.api.catalog`. Nothing works until main code configures the catalogue.

## Configuring it

Main code calls `configureCatalog(ctx, config)` from `onReady` or the app services, after the module registered its handlers:

```ts
import { configureCatalog } from '@drizztdourden08/brock-catalog/main';

configureCatalog(ctx, {
  label: 'Library',                                          // job titles and messages
  endpoint: {
    baseUrl: 'https://catalogue.example.com',
    headers: async () => ({ authorization: `Bearer ${await deviceToken()}` }),
    onUnauthorized: () => clearDeviceToken(),                 // after any 401
  },
  schema: { item: parseItem, page: parsePage, home: parseHome }, // the app's validators: unknown in, typed out
  routes: { grant: { method: 'POST', path: '/items/:id/download' } },  // defaults: GET /home, GET /items, GET /items/:id, POST /items/:id/download
  installers: { zip: presetInstaller },                      // by the grant's container
  maxBytes: 50 * 1024 * 1024,                                // or (grant) => a cap per kind
  linkScheme: 'my-app',                                      // install links: my-app://install/<id>?v=<n>
  onRelease: (record, replacement, ctx) => repointSelections(record, replacement),  // returns how many things let go
  onInstalled: (record) => refreshLibrary(record),
});
```

- The list follows `nextCursor` across pages (at most `maxPages`, 50 by default) so the renderer gets the whole list once. Item ids are checked before they reach a URL: letters, digits, `_` and `-`, up to 128, never `__x__`.
- A grant (`POST .../download` with `{ version }` when one is asked) is `{ itemId, version, label, url, bytes, sha256, container, kind?, meta? }`; `parseGrant` reads it unless `schema.grant` is given. It must name the item asked for, a container with an installer, a size above 0 and within `maxBytes`, and an `https` URL.
- An installer is `{ install({ file, grant, files, report }), uninstall(record, files), settleName? }`. It gets the verified download as a temp file (removed after) and `ctx.files`, the app's Data folder, and returns `{ installedName, ownName? }`: the one name it wrote, which uninstall gets back.

## Installing

`catalog:install` (`window.api.catalog.install({ itemId, version })`) runs a Brock job, `catalog-install:<itemId>`, with the steps `grant`, `download`, `verify` and `unpack`, so the job dialog and the title bar status show it and `jobs.cancel` stops it while the download runs. The download streams to a temp file and is hashed as it arrives; its size and sha256 must match the grant exactly, or nothing is unpacked. An item already installing is refused. An update installs the new copy first, then hands the old one to `onRelease` with the new name and removes it, then lets `settleName` move the new copy to its own name. The record goes to `Data/catalog/installed.json` (read-modify-write in one queue; a damaged file reads as empty) and the window hears `catalog:changed`. The answer is `{ ok: true, record }` or `{ ok: false, error, signedOut, cancelled }`.

`catalog:uninstall` refuses while the item installs, calls `onRelease(record, null)`, the installer's `uninstall`, removes the record and answers `{ ok: true, released }`.

The reads answer `{ ok: true, data }` or `{ ok: false, error, signedOut }`; `signedOut` is a 401.

## The installed guard

`useCatalogInstalled` is one store of the installed records for every screen; `watch()` loads it and reloads it on `catalog:changed`. `installedRecordOf(itemId)` and `installedByName(kind, name)` select one record, so an editor can lock an item the catalogue installed. `useCatalogItem(itemId, liveVersion?)` joins the record, the running job, `hasUpdate`, the last error and `install`, `uninstall` and `cancel`.

`CatalogInstallBar`, a compound on Tessera's `Button`, `ButtonRow`, `ProgressBar` and `Text`, draws it: Install, or Installed with Update and Uninstall, and the live bar with Cancel while the job runs. `installBarProps(useCatalogItem(id))` feeds it.

## Install links

With `linkScheme`, `<scheme>://install/<itemId>` and `?v=<n>` are parsed exactly (no other host, path, query or fragment, at most 256 characters); `createCatalogLinks(scheme)` gives `parse`, `format` and `fromArgv`. Declare the same scheme in `product.protocols`, so the installer registers it with the OS and Brock routes it: the module subscribes to `ctx.onOpen` and takes each `url` request of its scheme, whether it came in the launch argv, from a second launch (which hands it to the running app and quits) or as macOS `open-url`. Each link is held until the renderer takes them with `useCatalogLinks(onLink)`; after that each new one comes as `catalog:link`.

`getCatalog(ctx).links.deliverUrl(url)` is the manual path for a link that reaches the app any other way, such as one the user pastes; it answers whether the URL was an install link.
