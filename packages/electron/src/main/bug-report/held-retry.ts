/* @layer electron-main @kind logic */
import type { HeldRetry } from './bug-report.type';

const heldRetry: { current: HeldRetry | null; next: number } = { current: null, next: 0 };

export { heldRetry };
