/* @layer electron-main @kind logic */
import { freemem, totalmem } from 'os';
import type { MemoryDiagnostics } from '@drizztdourden08/brock-core/types';
import type { SwapUsage } from './collect-memory.type';

const collectSwap = (): SwapUsage => {
  try {
    const info = process.getSystemMemoryInfo();
    return { swapTotalBytes: info.swapTotal * 1024, swapFreeBytes: info.swapFree * 1024 };
  } catch {
    return { swapTotalBytes: null, swapFreeBytes: null };
  }
};

const collectMemory = (): MemoryDiagnostics => ({ totalBytes: totalmem(), freeBytes: freemem(), ...collectSwap() });

export { collectMemory };
