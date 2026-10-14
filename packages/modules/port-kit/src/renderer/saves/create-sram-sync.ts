/* @layer renderer-shell @kind logic */
import { contentHash } from '../../saves/content-hash';
import type { SramSource, SramSync, SramSyncOptions } from './save-session.type';
import { DEFAULT_SRAM_SYNC_MS } from './save-session.constants';

const coreReader = ({ definition, calls: callsOf, fs: fsOf }: SramSource): (() => Uint8Array | null) => () => {
  const { files, exports } = definition.core;
  const calls = callsOf();
  const fs = fsOf();
  if (!calls || !fs) return null;
  if (exports.saveSram) calls.call(exports.saveSram);
  return fs.analyzePath(files.sram).exists ? fs.readFile(files.sram) : null;
};

const createSramSync = (options: SramSyncOptions): SramSync => {
  const { store, profileId, intervalMs = DEFAULT_SRAM_SYNC_MS } = options;
  const readSram = 'read' in options ? options.read : coreReader(options.core);
  let timer: ReturnType<typeof setInterval> | null = null;
  let lastHash: number | null = null;

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
