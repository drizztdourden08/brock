/* @layer core @kind test */
import type { JobStepDef } from '@drizztdourden08/brock-core/types';
import type { JobHandle, MainContext } from '@drizztdourden08/brock-electron/main';

interface FakeJob {
  ctx: Pick<MainContext, 'job'>;
  events: string[];
  steps: JobStepDef[];
  controller: AbortController;
}

const fakeJob = (): FakeJob => {
  const events: string[] = [];
  const steps: JobStepDef[] = [];
  const controller = new AbortController();
  const job = (id: string, defs: readonly JobStepDef[]): JobHandle => {
    steps.push(...defs);
    const handle: JobHandle = {
      id, signal: controller.signal,
      step: (step) => { events.push(`step ${step}`); },
      progress: (fraction, line) => { events.push(`progress ${fraction}${line ? ` ${line}` : ''}`); },
      line: (text) => { events.push(`line ${text}`); },
      log: (message) => { events.push(`log ${message}`); },
      skip: () => undefined,
      done: () => { events.push('done'); },
      fail: (error) => { events.push(`fail ${error instanceof Error ? error.message : String(error)}`); },
      run: async (work) => {
        try {
          const result = await work(handle);
          handle.done();
          return result;
        } catch (error) {
          if (!controller.signal.aborted) handle.fail(error);
          throw error;
        }
      },
    };
    return handle;
  };
  return { ctx: { job }, events, steps, controller };
};

export { fakeJob };
