/* @layer electron-main @kind logic */
import { SCREENSHOT_TIMEOUT_FLAG } from './screenshot-flag.constants';

const screenshotTimeoutMs = (flag: string | null, fallbackMs: number): { ms: number; problem: string | null } => {
  if (flag === null) return { ms: fallbackMs, problem: null };
  const seconds = Number(flag);
  if (Number.isFinite(seconds) && seconds > 0) return { ms: Math.round(seconds * 1000), problem: null };
  return { ms: fallbackMs, problem: `${SCREENSHOT_TIMEOUT_FLAG}=${flag} is not a count of seconds above 0; waiting ${fallbackMs / 1000} s` };
};

export { screenshotTimeoutMs };
