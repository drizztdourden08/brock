/* @layer electron-main @kind logic */
const outputOf = (error: unknown, key: 'stderr' | 'stdout'): string => {
  const value: unknown = error instanceof Error && key in error ? Reflect.get(error, key) : null;
  return Buffer.isBuffer(value) ? value.toString('latin1').trim() : '';
};

const statusOf = (error: unknown): string => String(error instanceof Error && 'status' in error ? error.status : null);

const detailOf = (error: unknown): string => outputOf(error, 'stderr') || outputOf(error, 'stdout') || String(error);

const systemToolFailure = (exe: string, error: unknown): Error => new Error(`${exe} exited with ${statusOf(error)}: ${detailOf(error).slice(0, 400)}`, { cause: error });

export { systemToolFailure };
