/* @layer electron-main @kind logic */
import type { ReviewLogLine } from '@drizztdourden08/brock-core/review';

const tapMainConsole = (onLine: (line: ReviewLogLine) => void): (() => void) => {
  const originals = { warn: console.warn, error: console.error };
  for (const level of ['warn', 'error'] as const) {
    console[level] = (...args: unknown[]) => {
      originals[level](...args);
      onLine({ level, message: args.map(String).join(' ') });
    };
  }
  return () => {
    console.warn = originals.warn;
    console.error = originals.error;
  };
};

export { tapMainConsole };
