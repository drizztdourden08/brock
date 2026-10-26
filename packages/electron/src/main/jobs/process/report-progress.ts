/* @layer electron-main @kind logic */
import type { JobHandle } from '@drizztdourden08/brock-core/jobs';
import type { ProcessProgressHint, ProcessProgressParser, ProcessStream } from './process-job.type';

const hintOf = (parser: ProcessProgressParser, line: string, stream: ProcessStream): ProcessProgressHint | null => {
  try {
    const result = parser(line, stream);
    if (typeof result === 'number') return { fraction: result };
    return result ?? null;
  } catch {
    return null;
  }
};

const reportProgress = (job: JobHandle, parser: ProcessProgressParser | undefined, line: string, stream: ProcessStream): void => {
  const hint = parser ? hintOf(parser, line, stream) : null;
  if (!hint) return;
  if (typeof hint.fraction === 'number' && Number.isFinite(hint.fraction)) job.progress(hint.fraction, hint.label);
  else if (hint.label !== undefined) job.line(hint.label);
};

export { reportProgress };
