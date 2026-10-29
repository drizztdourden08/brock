/* @layer electron-main @kind type */
import type { verify, VerifyKeyObjectInput } from 'node:crypto';

type CryptoVerify = typeof verify;
type VerifyKey = Parameters<CryptoVerify>[2];
type VerifyCallback = Parameters<CryptoVerify>[4];
type Bytes = NodeJS.ArrayBufferView;
type VerifyArgs = [algorithm: string | null | undefined, data: Bytes, key: VerifyKey, signature: Bytes];
type VerifyCallbackArgs = [...VerifyArgs, callback: VerifyCallback];

interface EcNullDigestTarget {
  verify: CryptoVerify;
}

interface EcNullDigestOptions {
  enabled?: boolean;
  env?: NodeJS.ProcessEnv;
  versions?: NodeJS.ProcessVersions;
  onInstalled?: (message: string) => void;
  sync?: () => void;
}

export type {
  CryptoVerify, EcNullDigestOptions, EcNullDigestTarget, VerifyArgs, VerifyCallbackArgs, VerifyKey, VerifyKeyObjectInput,
};
