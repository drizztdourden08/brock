/* @layer electron-main @kind constants */
import type { SignInResult } from '../secrets.type';

const DEFAULT_POLL_MS = 3000;
const DEFAULT_TTL_MS = 10 * 60 * 1000;

const CANCELLED: SignInResult = { ok: false, reason: 'cancelled' };
const EXPIRED: SignInResult = { ok: false, reason: 'expired' };
const DENIED: SignInResult = { ok: false, reason: 'denied' };

export { DEFAULT_POLL_MS, DEFAULT_TTL_MS, CANCELLED, EXPIRED, DENIED };
