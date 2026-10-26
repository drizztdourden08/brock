/* @layer electron-main @kind logic */
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import type { ExitFacts, ProcessRunOptions } from './process-job.type';

const exitOutcome = (options: ProcessRunOptions, { code, signal, cancelled, tail }: ExitFacts): ProcessJobOutcome => {
  if (cancelled) return { status: 'cancelled', exitCode: code, tail };
  if (code !== null && (options.successCodes ?? [0]).includes(code)) return { status: 'done', exitCode: code, tail };
  const error = signal ? `${options.label} was stopped by ${signal}.` : `${options.label} exited with code ${String(code)}.`;
  return { status: 'failed', exitCode: code, tail, error };
};

export { exitOutcome };
