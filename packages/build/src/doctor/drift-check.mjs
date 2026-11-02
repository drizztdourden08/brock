/* @layer tooling-scripts @kind logic */
import { syncApp } from '../modules/sync.mjs';
import { workflowInputs } from '../release/workspace-workflow-inputs.mjs';

/**
 * @type {{ label: string, run: (ctx: { rootDir: string, config: import('../config.mjs').BrockConfig | null }) => Promise<{ problems: string[], detail: string }> }}
 */
const driftCheck = {
  label: 'Generated files',
  run: async ({ rootDir, config }) => {
    if (!config) return { problems: [], detail: 'no brock.config.ts, nothing is generated' };
    const { drifted } = syncApp(rootDir, config, { check: true, onMissing: 'skip', ...(await workflowInputs(rootDir)) });
    const problems = drifted.map((path) => `${path} differs from what brock sync writes. Fix: brock sync.`);
    return { problems, detail: 'every generated file matches what brock sync writes' };
  },
};

export { driftCheck };
