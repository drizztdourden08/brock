/* @layer core @kind logic */
import type { Result } from './result.type';

const fail = (error: string): Result => ({ success: false, error });

export { fail };
