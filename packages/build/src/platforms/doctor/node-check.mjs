/* @layer tooling-scripts @kind logic */
import { MIN_NODE_MAJOR } from './doctor.constants.mjs';
import { installHint } from './install-hint.mjs';

/**
 * @returns {import('../platform.type.mjs').DoctorCheck}
 */
const nodeCheck = () => ({
  label: `Node ${MIN_NODE_MAJOR}`,
  run: (ctx) => {
    const version = process.versions.node;
    if (Number(version.split('.')[0]) >= MIN_NODE_MAJOR) return { status: 'ok', detail: `v${version}` };
    return { status: 'missing', detail: `v${version} runs here`, install: installHint('node', ctx.host) };
  },
});

export { nodeCheck };
