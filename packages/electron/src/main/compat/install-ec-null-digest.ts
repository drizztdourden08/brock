/* @layer electron-main @kind logic */
import { syncBuiltinESMExports } from 'node:module';
import type { EcNullDigestOptions, EcNullDigestTarget } from './ec-null-digest.type';
import { EC_DIGEST_OFF_ENV } from './ec-null-digest.constants';
import { ecNullDigestState } from './ec-null-digest-state';
import { ecNullDigestVerify } from './ec-null-digest-verify';

const isWanted = (options: EcNullDigestOptions): boolean => {
  const env = options.env ?? process.env;
  const versions = options.versions ?? process.versions;
  return options.enabled !== false && env[EC_DIGEST_OFF_ENV] !== '1' && Boolean(versions.electron);
};

const installEcNullDigest = (target: EcNullDigestTarget, options: EcNullDigestOptions = {}): boolean => {
  if (!isWanted(options) || ecNullDigestState.original !== null) return false;
  ecNullDigestState.original = target.verify;
  target.verify = ecNullDigestVerify(target.verify);
  (options.sync ?? syncBuiltinESMExports)();
  options.onInstalled?.('crypto.verify with no algorithm now picks sha256 for EC keys (Electron has no default digest)');
  return true;
};

export { installEcNullDigest };
