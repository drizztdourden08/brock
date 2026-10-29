/* @layer electron-main @kind logic */
import { createPublicKey, KeyObject } from 'node:crypto';
import type { VerifyKey, VerifyKeyObjectInput } from './ec-null-digest.type';
import { EC_CURVES, EC_DEFAULT_DIGEST } from './ec-null-digest.constants';

const isKeyObjectInput = (key: VerifyKey): key is VerifyKeyObjectInput =>
  typeof key === 'object' && !Buffer.isBuffer(key) && !(key instanceof KeyObject) && key.key instanceof KeyObject;

const keyObjectOf = (key: VerifyKey): KeyObject => {
  if (isKeyObjectInput(key)) return createPublicKey(key.key);
  return createPublicKey(key);
};

const ecDigestOf = (key: VerifyKey): string | null => {
  try {
    const resolved = keyObjectOf(key);
    if (resolved.asymmetricKeyType !== 'ec') return null;
    const curve = resolved.asymmetricKeyDetails?.namedCurve;
    return curve !== undefined && EC_CURVES.has(curve) ? EC_DEFAULT_DIGEST : null;
  } catch {
    return null;
  }
};

export { ecDigestOf };
