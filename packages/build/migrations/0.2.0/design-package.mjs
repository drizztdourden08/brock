/* @layer tooling-scripts @kind logic */
import { designPackageStep } from '../../src/upgrade/index.mjs';

const migration = Object.freeze({
  id: 'design-package',
  summary: 'tessera.config.json at the repo root; a monorepo gets packages/design for its shared parts, and each app compound moves there when every import of it can be rewritten.',
  workspace: designPackageStep,
});

export { migration };
