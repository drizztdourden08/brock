<!-- @layer docs @kind doc -->
# Archipelia review against Brock (board item I-24, 2026-09-27)

Read-only review of `X:\archipelia` at about 17:05 against `docs/contributing/structure.md` and `docs/architecture.md`. Checks run: `pnpm -r --no-bail lint`, `brock structure --check`, `brock check` in `apps/desktop`.

## Findings

| # | Severity | Where | What | Fix |
|---|---|---|---|---|
| 1 | bypass | packages/hosts/src/local/log-hub.ts:4-21 | Hand-rolled log hub that copies brock-core `createLogBus`; its `lines` array has no cap, so a long MultiServer run grows without limit | `createLogBus({ channels: ['server'], maxEntries, mirrorToConsole: false })` from `@drizztdourden08/brock-core/log`; replay `getEntries()` on subscribe |
| 2 | bypass | packages/catalog/src/file-cache.ts:2,12,17-18 | Raw `node:fs` instead of the `FileStore` port; packages/presets already uses `FileStore`, so the two disagree | Take `files: FileStore` plus a relative cache dir; `files.readText` / `files.writeText` |
| 3 | bypass, secrets | packages/model/src/session.type.ts:25 | `ServerSettings.password?: string` is plaintext and persists inside SessionTemplate and Session.snapshot JSON; `ServerAuth` already uses `passwordRef` | Replace with `passwordRef`; resolve it in main through brock-secrets |
| 4 | shortcut, secrets | packages/hosts/src/local/server-args.ts:12 | The room password reaches MultiServer on argv, visible in the process list | Resolve it in main from brock-secrets and hand it over off argv (a per-session host.yaml `server_options`, to verify) |
| 5 | bypass | apps/desktop/brock.config.ts:15 | `modules: []` while the model already has `passwordRef` and `passphraseRef` and the screens promise a vault | `brock add secrets --local X:\brock` before any credential code lands |
| 6 | shortcut, secrets | packages/hosts/src/archipelago-gg/archipelago-gg.type.ts:13, client.ts:11 | `ownerId` is the archipelago.gg session UUID that grants room ownership: a credential with no owner of its storage | Store it only through brock-secrets and inject it from main |
| 7 | shortcut | apps/desktop/brock.config.ts:6-13, electron/main.ts:6 | No `product.dataDirs`, no `dataDomains`; presets writes Data/presets and the catalog needs a cache dir; the Data screen would reinvent the storage summary | Add `dataDirs` (profiles, config, presets, sessions, cache) and pass `dataDomains` to `bootstrapApp`; the Data screen reads `storage:getSummary` |
| 8 | shortcut | packages/engine/src/runtime/read-runtime.ts:9 | `JSON.parse(readFile) as EngineRuntime`: no BOM strip, no validation | `stripBom` from brock-core/storage, check the required fields |
| 9 | shortcut | packages/engine/src/options/read-options-schema.ts:22 | Same unvalidated `JSON.parse(...) as SchemaDump` | Same fix as 8 |
| 10 | shortcut | packages/catalog/src/parse-entry.ts:33, read-catalog.ts:26-27 | `as unknown as EntryToml/RootToml/LockToml` casts on untrusted remote TOML | A small shape guard per type; failures go into `problems` |
| 11 | shortcut | apps/desktop/package.json:2 vs package.json:2 | The app and the workspace root are both named `archipelia`; `pnpm --filter archipelia` is ambiguous | Rename the app `@archipelia/desktop` |
| 12 | shortcut | package.json:19 | Root `test: vitest run` with no `tests/` folder anywhere; pure logic is untested and vitest exits 1 with no files | `packages/<x>/tests/*.test.ts`, starting with catalog, engine/stages, presets |
| 13 | style | apps/desktop/package.json:5 | `"description": "A blank Brock app."` left from the template | The product description |
| 14 | style | apps/desktop/README.md:24,38-40 | Template text says the pnpm and lint files live in the app; in this workspace the root owns them | Reword per structure.md, "A Brock app inside a workspace" |
| 15 | style | packages/catalog/package.json:30 | `"smol-toml": "^1.4.2"` inline instead of `catalog:` | Move it to the root catalog |
| 16 | style | packages/hosts/src/archipelago-gg/client.ts:18 | `init.headers as Record<string, string>` cast | `new Headers(init.headers)` and `.set()` |
| 17 | style | apps/desktop/brock.config.ts:4 | A `//` comment from the template; it escapes `no-comments` only because config files are ignored | Removed from the Brock template; remove it here too |
| 18 | style | core/py/options_schema.py:1,19,95 | The docstring names `shared/types/options.ts`, which does not exist; two more comments | Point it at packages/model/src/options.type.ts and trim |
| 19 | style | tooling/engine-bundle/src/download.mjs:9, run.mjs:5, build-engine.mjs:42 | `sha256Of`, a `spawn` wrapper and `JSON.stringify(x, null, 2)` duplicate core helpers | Accepted: plain .mjs tooling cannot import TS-source packages |
| 20 | style | packages/hosts/src/archipelago-gg/suuid.ts:2-5 | `Buffer` makes a pure encoding helper Node-only | Fine while hosts stays main-side; otherwise base64url through `Uint8Array` |
| 21 | Brock bug | X:\brock\packages\core\src\platform\detect.ts, storage\hash.ts | brock-core did not typecheck under `tsconfig/node.json` (no DOM lib): `window` and `BufferSource`; packages/presets failed tsc on it and catalog and engine avoided core helpers | Fixed in Brock the same day: `globalThis` access and a copied `Uint8Array` for the digest. `pnpm install` in Archipelia picks it up through the link |

## Checked and clean

- No `window.api`, `ipcRenderer`, `ipcMain` or `contextBridge` anywhere.
- `src/ipc/contract.type.ts` augments `@drizztdourden08/brock-core/augment`; `electron/preload.ts` composes the base and app maps (`src/ipc/contract.constants.ts`) into `createPreloadBridge`.
- Every screen goes through `defineScreen`; navigation uses `useNavigation`.
- No `safeStorage`, `keytar` or `localStorage`; settings come from the `settings` prop.
- No eslint-disable, `@ts-ignore`, `any`, function declarations, inline exports, cross-package relative imports, deep `*/src/*` imports, lib/utils/helpers folders, or files over 200 lines (largest TS file: 66 lines).
- Managed files match the Brock templates byte for byte; `.brock/*` is generated; the root lint configs and `.npmrc` match `brock adopt` output.
- No npm lockfile, no `file:` specs; `workspace:*` between @archipelia packages, `link:` to Brock and Tessera, `catalog:` for shared versions.
- No package imports electron or react; Python is reached only from packages/engine and hosts through `child_process`.

## Check results

- `pnpm -r --no-bail lint`: model, engine, catalog, hosts, apps/desktop and tooling/engine-bundle pass; packages/presets failed tsc on finding 21 (fixed on the Brock side).
- `brock structure --check`: 7 packages under @archipelia, no findings.
- `brock check` in apps/desktop: in sync, 0 modules.

## What it does well

The desktop app is still the create-brock skeleton with untouched managed files. IPC contract and map composition are wired the Brock way. Screens, menu and rail use only BrockApp props. Each subject package has an alias, one barrel, header tags, arrow functions with grouped exports, and depends one way (model, then catalog, engine and presets, then hosts). packages/presets is the model to follow: it uses `readJson`, `writeJson`, `newId`, `assertSafeName` and `FileStore` from core instead of copying them. The Python engine is isolated behind packages/engine and core/py, with pinned, sha-checked downloads.
