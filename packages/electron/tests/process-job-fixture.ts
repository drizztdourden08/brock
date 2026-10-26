/* @layer electron-main @kind test */
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { createJobRegistry } from '@drizztdourden08/brock-core/jobs';
import type { JobRegistry } from '@drizztdourden08/brock-core/jobs';
import type { JobLogLine, JobSnapshot } from '@drizztdourden08/brock-core/types';
import { createProcessJobs } from '../src/main/jobs/process/create-process-jobs';
import type { ProcessJobs } from '../src/main/jobs/process/process-job.type';
import type { MainContext } from '../src/main/types/main-context.type';

const CHILD_SOURCE = `
import { spawn } from 'node:child_process';
const [mode, arg] = process.argv.slice(2);
const hold = () => setInterval(() => undefined, 1000);
if (mode === 'lines') {
  console.log('alpha');
  console.error('bravo');
  console.log('x'.repeat(10000));
} else if (mode === 'half') {
  console.log('PROGRESS 50 half way');
  hold();
} else if (mode === 'exit') {
  process.exitCode = Number(arg);
} else if (mode === 'echo') {
  console.log('ECHO ' + arg);
} else if (mode === 'env') {
  console.log('ENV ' + Object.keys(process.env).join(','));
} else if (mode === 'tree') {
  const child = spawn(process.execPath, ['-e', 'setInterval(() => undefined, 1000)'], { stdio: 'ignore' });
  console.log('CHILD ' + child.pid);
  hold();
} else {
  console.log('READY');
  hold();
}
`;

interface ProcessFixture {
  dir: string;
  command: string;
  argv: (...rest: string[]) => string[];
  jobs: JobRegistry;
  processes: ProcessJobs;
  snapshot: (id: string) => JobSnapshot | undefined;
  messages: (id: string) => string[];
  lines: (id: string) => JobLogLine[];
  dispose: () => void;
}

const createProcessFixture = (): ProcessFixture => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-process-'));
  const script = join(dir, 'child.mjs');
  writeFileSync(script, CHILD_SOURCE);
  const context = { paths: { userData: () => dir } } as Partial<MainContext> as MainContext;
  const jobs = createJobRegistry(() => undefined);
  const processes = createProcessJobs({ job: jobs.start, jobs, context: () => context });
  const snapshot = (id: string): JobSnapshot | undefined => jobs.list().find((job) => job.id === id);
  const lines = (id: string): JobLogLine[] => snapshot(id)?.log ?? [];
  return {
    dir,
    command: process.execPath,
    argv: (...rest) => [script, ...rest],
    jobs,
    processes,
    snapshot,
    lines,
    messages: (id) => lines(id).map((line) => line.message),
    dispose: () => {
      processes.cancelAll();
      rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    },
  };
};

export { createProcessFixture };
export type { ProcessFixture };
