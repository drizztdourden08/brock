/* @layer electron-main @kind constants */
import type { BootProgress } from '@drizztdourden08/brock-core/boot';

const REVEAL_MS = 220;
const WATCHDOG_MS = 8000;
const DEV_WATCHDOG_MS = 30_000;
const RENDERER_RESERVE_WEIGHT = 4;
const ABORTED_LOAD = -3;
const EMPTY_PROGRESS: BootProgress = { done: 0, total: 0, label: '', detail: null };
const INTERFACE_TASK = { task: 'interface', label: 'Loading the interface' } as const;

export { ABORTED_LOAD, DEV_WATCHDOG_MS, EMPTY_PROGRESS, INTERFACE_TASK, RENDERER_RESERVE_WEIGHT, REVEAL_MS, WATCHDOG_MS };
