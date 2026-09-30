/* @layer tooling-scripts @kind logic */
import { artifactPrefixOf } from '../packaging/release-names.mjs';
import { DEFAULT_TARGETS } from '../platforms/platforms.constants.mjs';
import { composeWorkflows } from './compose-workflows.mjs';
import { CI_WORKFLOW_FILE, RELEASE_WORKFLOW_FILE } from './workflows.constants.mjs';

/**
 * @param {import('../config.mjs').BrockConfig} config
 * @param {{ manifest: Record<string, any> }[]} modules
 * @returns {{ path: string, content: string }[]} ci.yml and release.yml for a standalone app
 */
const renderWorkflows = (config, modules) => {
  const { ci, release } = composeWorkflows({
    targets: config.targets ?? DEFAULT_TARGETS,
    prefix: artifactPrefixOf(config.product),
    systemSteps: modules.flatMap((m) => m.manifest.ci ?? []),
  });
  return [{ path: CI_WORKFLOW_FILE, content: ci }, { path: RELEASE_WORKFLOW_FILE, content: release }];
};

export { renderWorkflows };
