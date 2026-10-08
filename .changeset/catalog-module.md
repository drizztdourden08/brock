---
'@drizztdourden08/brock-catalog': minor
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-react': minor
---

New module `@drizztdourden08/brock-catalog` (`brock add catalog`): a content catalogue client. The app configures it once with `configureCatalog(ctx, config)`: its endpoint and headers, its schema validators, its routes, an installer per container, a size cap, an install link scheme and release hooks. The renderer reads the home, the whole list and one item over `window.api.catalog`; installs run as Brock jobs (`catalog-install:<id>`: grant, download, verify, unpack) that stream the download to a temp file, check its size and sha256 against the grant before anything is unpacked, and can be cancelled while they download; an update installs the new copy before it releases and removes the old one. The installed record lives in `Data/catalog/installed.json`, and `useCatalogInstalled`, `installedRecordOf` and `installedByName` give every screen the installed guard. Install links (`<scheme>://install/<id>?v=<n>`) are parsed strictly, held until the renderer takes them with `useCatalogLinks`, and taken from the main context's `onOpen` when Brock provides it. `CatalogInstallBar` draws install, update, uninstall and the live progress with Tessera parts; the app tree gains its answer under actions.
