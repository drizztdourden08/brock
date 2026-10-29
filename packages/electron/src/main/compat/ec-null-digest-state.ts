/* @layer electron-main @kind logic */
import type { CryptoVerify } from './ec-null-digest.type';

const ecNullDigestState: { original: CryptoVerify | null } = { original: null };

export { ecNullDigestState };
