/* @layer electron-main @kind logic */
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import { checkProcessSpec } from './check-process-spec';
import { PROCESS_ERROR_MAX_CHARS, PROCESS_ID_PATTERN, PROCESS_STEP_ID } from './process-job.constants';
import type { PreparedProcessJob, ProcessJobDef, ProcessJobs, ProcessJobsDeps, ProcessRunOptions, ProcessSpec } from './process-job.type';
import { runProcess } from './run-process';

const rejected = (error: string): ProcessJobOutcome => ({ status: 'rejected', error: error.slice(0, PROCESS_ERROR_MAX_CHARS) });

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const optionsOf = ({ label, progress, successCodes, elevate, cancel }: ProcessRunOptions): ProcessRunOptions => ({
  label, progress, successCodes, elevate, cancel,
});

const createProcessJobs = (deps: ProcessJobsDeps): ProcessJobs => {
  const defs = new Map<string, PreparedProcessJob>();
  const kills = new Map<string, () => void>();
  const busy = new Set<string>();

  const define = <A>(id: string, def: ProcessJobDef<A>): void => {
    if (!PROCESS_ID_PATTERN.test(id)) throw new Error(`"${id}" is not a valid process job id`);
    if (defs.has(id)) throw new Error(`process job "${id}" is already defined`);
    defs.set(id, {
      options: optionsOf(def),
      prepare: async (raw) => def.resolve(def.parse(raw), deps.context()),
    });
  };

  const begin = (id: string, spec: ProcessSpec, options: ProcessRunOptions): Promise<ProcessJobOutcome> => {
    const job = deps.job(id, [{ id: PROCESS_STEP_ID, label: options.label }], { title: options.label, cancellable: true });
    job.step(PROCESS_STEP_ID);
    const track = (kill: () => void): (() => void) => {
      kills.set(id, kill);
      return () => kills.delete(id);
    };
    const cwd = spec.cwd ?? deps.context().paths.userData();
    return runProcess(job, { ...spec, cwd }, { ...options, track });
  };

  const run: ProcessJobs['run'] = async (id, spec, options) => {
    if (busy.has(id)) return rejected(`job "${id}" is already running`);
    const problem = checkProcessSpec(spec);
    if (problem) return rejected(problem);
    busy.add(id);
    try {
      return await begin(id, spec, options);
    } catch (error) {
      return rejected(messageOf(error));
    } finally {
      busy.delete(id);
    }
  };

  const start: ProcessJobs['start'] = async (id, raw) => {
    const prepared = typeof id === 'string' ? defs.get(id) : undefined;
    if (!prepared) return rejected('No such process job.');
    if (busy.has(id)) return rejected(`job "${id}" is already running`);
    let spec: ProcessSpec;
    try {
      spec = await prepared.prepare(raw);
    } catch (error) {
      return rejected(`Invalid arguments: ${messageOf(error)}`);
    }
    return run(id, spec, prepared.options);
  };

  const cancelAll = (): void => {
    for (const id of busy) deps.jobs.cancel(id);
    for (const kill of kills.values()) kill();
  };

  return { define, start, run, cancelAll };
};

export { createProcessJobs };
