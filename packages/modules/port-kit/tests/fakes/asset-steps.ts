/* @layer core @kind test */
import type { AssetWorkerSteps } from '../../src/assets/worker/asset-worker.type';

const ASSET_STEPS: AssetWorkerSteps = {
  tiles: (input, report) => {
    report.progress(0.5, 'half');
    report.log('tiles ready');
    return new Uint8Array([Number(input), 2]);
  },
  sounds: async (_input, report) => {
    report.line('mixing');
    return Promise.resolve({ count: 3 });
  },
  source: (input, _report, data) => ({ input, data }),
  broken: () => {
    throw new Error('bad chunk');
  },
  slow: (_input, report) => {
    report.line('waiting');
    return new Promise(() => undefined);
  },
};

export { ASSET_STEPS };
