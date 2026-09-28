/* @layer core @kind logic */
import type { Result } from './result.type';

const ok = (): Result => ({ success: true });

export { ok };
