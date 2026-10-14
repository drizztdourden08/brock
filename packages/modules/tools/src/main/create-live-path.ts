/* @layer electron-main @kind logic */
import { PATH_TTL_MS } from './tools-main.constants';

const createLivePath = (read: () => Promise<string>, ttlMs = PATH_TTL_MS, now: () => number = Date.now): (() => Promise<string>) => {
  let last: { at: number; value: Promise<string> } | null = null;
  return () => {
    if (last === null || now() - last.at >= ttlMs) last = { at: now(), value: read() };
    return last.value;
  };
};

export { createLivePath };
