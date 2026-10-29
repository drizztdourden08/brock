/* @layer electron-main @kind constants */
const EC_DIGEST_OFF_ENV = 'BROCK_NO_EC_DIGEST_SHIM';

const EC_DEFAULT_DIGEST = 'sha256';

const EC_CURVES: ReadonlySet<string> = new Set([
  'prime256v1', 'secp256r1', 'P-256',
  'secp384r1', 'P-384',
  'secp521r1', 'P-521',
]);

export { EC_CURVES, EC_DEFAULT_DIGEST, EC_DIGEST_OFF_ENV };
