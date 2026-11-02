/* @layer electron-main @kind logic */
import { ok } from '@drizztdourden08/brock-core/result';
import type { Result } from '@drizztdourden08/brock-core/result';
import { codeOf } from './registry-code';
import { failure } from './registry-failure';
import { ERROR_FILE_NOT_FOUND, ERROR_SUCCESS } from './win32-api.constants';

const removalResult = (call: string, value: unknown): Result => {
  const code = codeOf(value);
  return code === ERROR_SUCCESS || code === ERROR_FILE_NOT_FOUND ? ok() : failure(call, code);
};

export { removalResult };
