/* @layer core @kind logic */
const bootTimeoutError = (label: string, timeoutMs: number): Error =>
  Object.assign(new Error(`${label} took longer than ${Math.round(timeoutMs / 1000)} s`), { name: 'BootTimeoutError' });

export { bootTimeoutError };
