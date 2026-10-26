/* @layer electron-main @kind logic */
import type { ProcessRunOptions } from './process-job.type';

const positive = (value: number | undefined): boolean => value === undefined || (Number.isFinite(value) && value > 0);

const checkRunOptions = (options: ProcessRunOptions): string | null => {
  if (!positive(options.timeoutMs)) return 'timeoutMs must be a positive number.';
  if (!positive(options.cancel?.graceMs)) return 'cancel.graceMs must be a positive number.';
  const maxBytes = options.logFile ? options.logFile.maxBytes : undefined;
  if (maxBytes !== undefined && !(Number.isInteger(maxBytes) && maxBytes > 0)) return 'logFile.maxBytes must be a positive whole number.';
  if (options.successCodes?.some((code) => !Number.isInteger(code))) return 'successCodes must be whole numbers.';
  return null;
};

export { checkRunOptions };
