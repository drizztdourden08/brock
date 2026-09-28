/* @layer electron-main @kind types */
import type { MemoryDiagnostics } from '@drizztdourden08/brock-core/types';

type SwapUsage = Pick<MemoryDiagnostics, 'swapTotalBytes' | 'swapFreeBytes'>;

export type { SwapUsage };
