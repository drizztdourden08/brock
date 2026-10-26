/* @layer electron-main @kind logic */
import type { ProcessJobOutcome } from '@drizztdourden08/brock-core/types';
import { checkProcessSpec } from './check-process-spec';
import { checkRunOptions } from './check-run-options';
import { PROCESS_ERROR_MAX_CHARS, PROCESS_ID_PATTERN } from './process-job.constants';
import type { PreparedProcessJob, ProcessJobDef, ProcessJobs, ProcessJobsDeps, ProcessRunOptions, ProcessSpec } from './process-job.type';
import { startProcessJob } from './start-process-job';

const rejected = (error: string): ProcessJobOutcome => ({ status: 'rejected', error: error.slice(0, PROCESS_ERROR_MAX_CHARS) });

const messageOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const optionsOf = (def: ProcessRunOptions): ProcessRunOptions => ({
  label: def.label,
  progress: def.progress,
  successCodes: def.successCodes,
  elevate: def.elevate,
  cancel: def.cancel,
  cancellable: def.cancellable,
  timeoutMs: def.timeoutMs,
  redact: def.redact,
  log: def.log,
  allow: def.allow,
});

const createProcessJobs = (deps: ProcessJobsDeps): ProcessJobs => {
  const defs = new Map<string, PreparedProcessJob>();
  const kills = new Map<string, () => void>();
  const busy = new Set<string>();

  const define = <A>(id: string, def: ProcessJobDef<A>): void => {
    if (!PROCESS_ID_PATTERN.test(id)) throw new Error(`"${id}" is not a valid process job id`);
    if (defs.has(id)) throw new Error(`process job "${id}" is already defined`);
    const problem = checkRunOptions(def);
    if (problem) throw new Error(problem);
    defs.set(id, {
      options: optionsOf(def),
      prepare: async (raw) => def.resolve(def.parse(raw), deps.context()),
    });
  };

  const begin = (id: string, spec: ProcessSpec, options: ProcessRunOptions, tracked: { value: boolean }): Promise<ProcessJobOutcome> => {
    const track = (kill: () => void): (() => void) => {
      tracked.value = true;
      kills.set(id, kill);
      return () => {
        kills.delete(id);
        busy.delete(id);
      };
    };
    return startProcessJob(deps, { id, spec, options, track });
  };

  const run: ProcessJobs['run'] = async (id, spec, options) => {
    if (busy.has(id)) return rejected(`job "${id}" is already running`);
    const problem = checkProcessSpec(spec, options.allow) ?? checkRunOptions(options);
    if (problem) return rejected(problem);
    busy.add(id);
    const tracked = { value: false };
    try {
      return await begin(id, spec, options, tracked);
    } catch (error) {
      return rejected(messageOf(error));
    } finally {
      if (!tracked.value) busy.delete(id);
    }
  };

  const start: ProcessJobs['start'] = async (id, raw, authorize) => {
    const prepared = typeof id === 'string' ? defs.get(id) : undefined;
    if (authorize && !authorize({ anyWindow: prepared?.options.allow?.otherWindows === true })) return rejected('Not allowed from this window.');
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
