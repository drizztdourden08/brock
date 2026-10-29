<!-- @layer docs @kind doc -->
# Cloning a worktree instead of rebuilding it

`<repo> worktree create` starts a new worktree from what another checkout of the same lockfile already has. It runs no `pnpm install` and no first build when it can avoid them. The code is `packages/thread/src/worktree/clone`, and the build side is the content-keyed build reuse in `packages/build/src/build-reuse`.

## The flow

1. `git worktree add`, as before.
2. **Pick a source.** The main checkout, when its installed lockfile (`node_modules/.pnpm/lock.yaml`) equals the new worktree's `pnpm-lock.yaml` byte for byte. Else the newest registered worktree that matches. No match means a real `pnpm install`, as before.
3. **The shared package store.** The source's virtual store (`node_modules/.pnpm`) is copied once into a shared folder, as hardlinks, with every link inside it rewritten to point inside the copy. Its name is a hash of the installed lockfile, the layout settings of `.modules.yaml` (hoist patterns, node linker), the platform and the store layout version. The entry is laid out like a checkout: `<entry>/node_modules/.pnpm` holds the packages and `<entry>/node_modules` holds the links of the source's root `node_modules`, so a package that finds a dependency by walking up its folders (such as `electron-vite` finding `electron`) finds it in the store as it did in the checkout. A hoisted link or a root link to a workspace package is left out, since the store is shared by every worktree. A link inside a package folder that points into the checkout stops the copy, and the worktree gets a real install. The first copy takes about as long as an install; every later worktree of that lockfile reuses it.
4. **Link node_modules.** Each project folder of the lockfile gets its `node_modules` as links only: packages point into the shared store, workspace packages point into the new worktree, `link:` packages outside the checkout keep their target. The `.bin` shims and `.modules.yaml` are rewritten the same way. A link whose new target does not exist undoes the copy and runs a real install. `node_modules/.brock-clone.json` records the source and the store.
5. **Copy build records.** `node_modules/.vite/brock-build-reuse` always comes over: its records check their own inputs. The ignored outputs Brock and Tessera generate (`dist`, `guide`, brand icons and `src/guide` files; never `.brock/profile-config.json` or user data) come over only when the source's tracked files under the app folder equal the new worktree's commit and nothing untracked sits there (`git diff --quiet <commit> -- <app>`).
6. **Provision** runs as before. `brock prewarm` starts in the background only when no build record came over.

`--no-clone` always runs `pnpm install`. `--skip-install` still skips both.

## Where the store lives

`BROCK_MODULES_STORE_DIR` when it is set. Else `~/.brock/cache/node-modules` when the home folder is on the volume of the checkout, else `<volume>/.brock-store/node-modules` (`X:\.brock-store\node-modules`). It must sit on the checkout's volume so its files can be hardlinks. A store is built in `<root>/.tmp/<key>-<uuid>`, its `.brock-store.json` written last, then renamed into place; two creates that race both build and the first rename wins.

## Why a pnpm install never writes into the store

A cloned worktree's `.modules.yaml` names the shared store as its virtual store. A plain `pnpm install` in that worktree sees a virtual store other than its own `node_modules/.pnpm`, so it asks to remove `node_modules` and install from scratch (and stops with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` with no terminal). It never adds or removes packages inside the shared store. Removing `node_modules`, or the whole worktree with `worktree remove`, deletes the links only.

## What was measured and left out

- pnpm's own global virtual store (`enableGlobalVirtualStore`) took as long as a normal install on this machine even when every package was already in it (176 s for Archipelia, cold and warm), and `electron-vite` could not find `electron` from inside it. It is not used.
- Hardlinking every package file into each new worktree (135,000 files for Archipelia) took 224 s. Some files also reach the NTFS limit of 1023 links, so a copy has to stand in. That is why the store is shared by folder links instead.

## Build reuse keyed on content

The records in `node_modules/.vite/brock-build-reuse` (format 3) no longer key files by path and modification time only:

- Files in the app's git repository are keyed by their blob id when git reports them clean, else by a hash of their content. Each folder they sit in is keyed by the names git lists there, tracked and untracked, so a new file that shadows an import still rebuilds. Paths are relative to the repository root.
- Files in pnpm's package store are left out: the installed lockfile is part of the key.
- Other files (a linked Brock or Tessera checkout) keep their path, time and size stamps.
- The key itself hashes the content of `package.json`, `brock.config.ts`, the lockfiles and env files, and replaces the app and workspace folders with tokens in the config part.

A record written in one checkout is therefore valid in another checkout of the same tree. A build that sees a repository file change while it runs writes no record.

The shared renderer dependency cache (`~/.brock/cache/vite-deps`, format 2) stores each dependency source relative to the package store, so a cloned worktree whose packages live in the shared store can be seeded too. The renderer dev server is allowed to serve files from the package store wherever `.modules.yaml` puts it.
