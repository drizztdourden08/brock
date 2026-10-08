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
    });
  },
});
```

The renderer then drives it by id:

```tsx
const { state, userCode, lastError, begin, cancel } = useSignIn('account');
```

`state` is `signed-out`, `waiting` or `signed-in`. `useSecretsStore` holds `metas`, `canStore`, `refresh`, `set` and `remove` for a settings tab; the module ships no screen of its own.
