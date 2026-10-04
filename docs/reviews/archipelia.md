<!-- @layer docs @kind doc -->
# Archipelia against the app structure

This review used to sit in [app-structure.md](../app-structure.md), the standard every app follows. It is one app's state, so it lives here now.

Archipelia (`X:\archipelia`, main and `.worktrees/upgrade`, both at 0fcdbe4) against the app structure of that day:

- `src/main.tsx` still passes `screens={SCREENS}`, `home={BASE_SCREEN}` and `menu={MENU}`: `navigation/SessionScreen.tsx` is a hand `defineScreen` and `menu.constants.ts` holds four entries. The menu entries move to `screens.config.ts`; the session screen stays a hand base screen (see the end of this page).
- The six session widgets are built by a `sessionWidget()` factory (`src/widgets/session-widget.ts`) and registered with `registerWidgets(SESSION_WIDGETS)` in `main.tsx`. Each becomes `src/widgets/<id>.widget.tsx` (players, hints, room, log, console, spoiler) rendering `SessionWidget` with its id; the `widget-files` migration lists them as to-dos.
- `src/widgets` holds 33 files that are not widgets: `live-room/` (24 logic files), `session-layout*`, `reset-session-widgets`, `in-widget-window`, `widget-window.constants`. They move to `views/SessionDashboard/behavior/` or `packages/sessions`; `brock structure` flags them once the folder is checked.
- `src/state/` holds the zustand stores (6 `use*Store.ts`) and listener helpers: the stores belong in `src/stores/`, the `listen-to-*` starters in `src/boot/<id>.task.ts` (they run at the top of `main.tsx` today).
- `src/navigation/`, `src/setting-controls/` and `src/guide/` have no slot: `navigation/useAppNavigation.ts` goes to `src/hooks/`, the setting control renderer to a compound or `src/views/`, and `guide/view-parts.type.ts` (a hand list of the 12 views) goes stale with every new view.
- The IPC channels live in a separate `archipelia` preload namespace (`electron/archipelia-preload.ts`, `src/ipc/archipelia-api.ts`) while `APP_*_MAP` in `src/ipc/contract.constants.ts` are empty; the channels belong in the app maps. `src/ipc/secret-names.constants.ts` is not IPC.
- `electron/services/` (22 files) is domain wiring in the app; most of it (server store, catalog service, import and export) belongs in `packages/*`, with only the composition left in the app.
- `electron/handlers/*-handlers.ts` matches this page; `gg-handlers.constants.ts` holds one regex that can live beside its user.
- `packages/design/src/compounds/OptionControl/sub-components/` has five loose `.tsx` controls; `tessera.config.json` names `primitives`, `composites` and `stories` folders that do not exist.
- `core/py/options_schema.py` is the only file in `core/`; it belongs to `tooling/engine-bundle/` or `packages/engine/`.
- `apps/desktop` has no `eslint.config.mjs` or `stylelint.config.mjs` (`brock sync` writes them), keeps `upgrade-report.md` in the tree, and ignores `public/logos` and `build/` although the logos are generated and the installer folder holds overrides only.
- Duplicated helpers: `isRecord` (engine, catalog), `isStringList` (presets, design), `host-label.ts` (two views, different logic); `tests/session/` and `tests/sessions/` are two folders for one area.

The session screen is a base screen: it draws under every other screen while a profile is active. No screen file kind is a base screen yet, so it stays a hand `defineScreen` passed as `home`; a `.layer.tsx` or a page does not fit it.
