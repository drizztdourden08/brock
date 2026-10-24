<!-- @layer docs @kind doc -->
# brock-secrets

Named secrets kept encrypted with Electron `safeStorage`, and a device-code sign-in driver. A secret is written once from the renderer and read in clear by main only. The renderer never sees a stored value.

## What it stores

| Path under `Data/` | Holds |
|---|---|
| `secrets/<name>.bin` | The ciphertext of one secret. The name passes core's `assertSafeName`. |
| `secrets/index.json` | `{ name, createdAt, updatedAt, label? }[]`, the metadata the renderer can list. |

When `safeStorage.isEncryptionAvailable()` is false, `set` throws and nothing is written. A plain-text secret on disk is worse than asking again.

## Install

```sh
brock add secrets
```

`brock sync` then imports the module on all three sides. The preload adds `window.api.secrets`:

```ts
window.api.secrets.set(name, value, label?)   // encrypt and store
window.api.secrets.has(name)
window.api.secrets.list()                     // SecretMeta[]
window.api.secrets.delete(name)
window.api.secrets.canStore()
window.api.secrets.signIn.begin(providerId)   // SignInResult
window.api.secrets.signIn.cancel(providerId)
window.api.secrets.signIn.signedIn()          // { [providerId]: boolean } for providers that can tell
window.api.secrets.signIn.onCode((providerId, userCode) => ...)
```

## Main side

Other main code reads the clear value through the context, never over IPC:

```ts
import { getSecrets } from '@drizztdourden08/brock-secrets/main';

const token = await getSecrets(ctx).get('api-token');
```

`getSecrets(ctx)` returns the store (`canStore`, `set`, `get`, `has`, `list`, `delete`) plus `registerSignInProvider`. `createSecretStore(ctx)` builds a store on its own for code that does not want the shared one.

## The sign-in driver

`createDeviceSignIn` runs a device-code flow: begin asks for a short user code, the code goes to the renderer, the browser opens on the verify page, and the driver polls until the code is confirmed, denied or expired. The app supplies the HTTP calls; the driver owns the timing and the cancel.

```ts
const signIn = createDeviceSignIn({
  begin: () => api.post('device/begin'),                 // { id, userCode, verifyUrl, pollSecret }
  poll: (id, pollSecret) => api.post('device/poll', { id, pollSecret }),   // { status, token? }
  onToken: (token) => getSecrets(ctx).set('api-token', token),
  pollMs: 3000,
  ttlMs: 10 * 60 * 1000,
});
const result = await signIn.begin((userCode, verifyUrl) => ...);
signIn.cancel();
```

`status` is one of `pending`, `confirmed`, `denied`, `expired`, `used`. The result is `{ ok: true }` or `{ ok: false, reason, message? }` with `reason` in `denied`, `expired`, `cancelled`, `unavailable`, `error`.

## Registering a provider

An app registers a provider from its own main handlers or `onReady`, which run after the module:

```ts
bootstrapApp(product, {
  modules: mainModules,
  onReady: (ctx) => {
    getSecrets(ctx).registerSignInProvider({
      id: 'account',
      begin: () => ...,
      poll: (id, pollSecret) => ...,
      onToken: (token) => getSecrets(ctx).set('api-token', token),
      tokenSecret: 'api-token',
    });
  },
});
```

`tokenSecret` names the secret `onToken` writes, so the module can tell a stored sign-in from none. A provider that keeps its token elsewhere passes `isSignedIn: () => boolean | Promise<boolean>` instead, which wins over `tokenSecret`. A provider with neither is left out of `signIn.signedIn()`.

The renderer then drives it by id:

```tsx
const { state, userCode, lastError, begin, cancel } = useSignIn('account');
```

`state` is `signed-out`, `waiting` or `signed-in`. The module's renderer boot task (`secrets-sign-in`) reads `signIn.signedIn()` before the window shows, so a provider with a stored token starts `signed-in` and the screen never draws the signed-out state first. `useSignIn` reads it too when the boot task did not run, and `useSignInStore` keeps `loaded` and `loadSignedIn()` for a refresh after the app removed a token. `useSecretsStore` holds `metas`, `canStore`, `refresh`, `set` and `remove` for a settings tab; the module ships no screen of its own.

## Headless apps: the Node store

A server with no Electron and no OS keychain imports the Node entry. It never imports `electron`, and it has the same `canStore`, `set`, `get`, `has`, `list` and `delete` as the main-side store.

```ts
import { createNodeSecretStore } from '@drizztdourden08/brock-secrets/node';

const secrets = createNodeSecretStore({ dataDir: '/var/lib/my-server/Data' });
await secrets.set('api-token', token);
const value = await secrets.get('api-token');
```

**This store is not encrypted at rest.** A value sits in plain text in `<dataDir>/secrets/secrets.json`. Anyone who can read that file can read every secret. Keep the data folder private to the service user, and prefer the environment for secrets you do not want on disk at all. The type says it too: `NodeSecretStore.encryptedAtRest` is the literal `false`.

| Platform | Protection |
|---|---|
| posix | The file is written with mode 0600 and the folder with mode 0700, so only the owner reads it. |
| Windows | Node ignores the mode. The file keeps the access list its folder gives it, normally the user profile. Put `dataDir` where only the service account has access. |

Writes are atomic: the store writes a temporary file beside the target, then renames it over the target. A crash leaves the old file or the new one, never half of one.

An environment variable overrides the file for a key. The variable is `BROCK_SECRET_` plus the key in upper case, with each run of characters outside `A-Z` and `0-9` turned into one `_`. So `api-token` reads `BROCK_SECRET_API_TOKEN`, and `lobby.admin key` reads `BROCK_SECRET_LOBBY_ADMIN_KEY`. An empty variable counts as unset. `get` and `has` see the override. `set` and `delete` touch the file only, and `list` lists the file only. `envPrefix` changes the prefix and `env` replaces `process.env`, which is how tests inject values.
