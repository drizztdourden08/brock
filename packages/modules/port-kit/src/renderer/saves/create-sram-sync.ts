/* @layer renderer-shell @kind logic */
import { contentHash } from '../../saves/content-hash';
import type { SramSync, SramSyncOptions } from './save-session.type';
import { DEFAULT_SRAM_SYNC_MS } from './save-session.constants';

const createSramSync = ({ core, store, profileId, intervalMs = DEFAULT_SRAM_SYNC_MS }: SramSyncOptions): SramSync => {
  const { files, exports } = core.definition.core;
  let timer: ReturnType<typeof setInterval> | null = null;
  let lastHash: number | null = null;

  const readSram = (): Uint8Array | null => {
    const calls = core.calls();
    const fs = core.fs();
    if (!calls || !fs) return null;
    if (exports.saveSram) calls.call(exports.saveSram);
    return fs.analyzePath(files.sram).exists ? fs.readFile(files.sram) : null;
  };

  const flush = async (): Promise<boolean> => {
    const bytes = readSram();
    if (!bytes) return false;
    const hash = contentHash(bytes);
    if (hash === lastHash) return false;
    lastHash = hash;
    await store.write(profileId, bytes.slice());
    return true;
  };

  const pause = (): void => {
    if (timer !== null) clearInterval(timer);
    timer = null;
  };

  const resume = (): void => {
    if (timer !== null) return;
    timer = setInterval(() => void flush(), intervalMs);
  };

  const start = (): void => {
    pause();
    lastHash = null;
    resume();
  };

  const stop = async (): Promise<void> => {
    pause();
    await flush();
  };

  return { start, stop, pause, resume, flush };
};

export { createSramSync };
