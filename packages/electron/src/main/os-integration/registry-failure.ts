/* @layer electron-main @kind logic */

const failure = (call: string, code: number): { success: false; error: string } => ({ success: false, error: `${call} failed with code ${String(code)}` });

export { failure };
