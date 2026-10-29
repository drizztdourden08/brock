/* @layer electron-main @kind logic */
import type { CryptoVerify, VerifyArgs, VerifyCallbackArgs, VerifyKey } from './ec-null-digest.type';
import { ecDigestOf } from './ec-digest-of';

const digestFor = (algorithm: string | null | undefined, key: VerifyKey): string | null | undefined =>
  algorithm ?? ecDigestOf(key) ?? algorithm;

const ecNullDigestVerify = (original: CryptoVerify): CryptoVerify => {
  function wrapped(...args: VerifyArgs): boolean;
  function wrapped(...args: VerifyCallbackArgs): void;
  function wrapped(...args: VerifyArgs | VerifyCallbackArgs): boolean | void {
    const picked = digestFor(args[0], args[2]);
    if (args.length === 5) return original(picked, args[1], args[2], args[3], args[4]);
    return original(picked, args[1], args[2], args[3]);
  }
  return wrapped;
};

export { ecNullDigestVerify };
