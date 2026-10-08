/* @layer tooling-scripts @kind logic */
import { join, relative } from 'node:path';
import { artifactPrefixOf } from '../packaging/release-names.mjs';
import { DEFAULT_TARGETS } from '../platforms/platforms.constants.mjs';
import { composeWorkflows, workspaceCi } from './compose-workflows.mjs';
import { releaseLayout } from './release-layout.mjs';
import { CI_WORKFLOW_FILE, RELEASE_WORKFLOW_FILE, WORKFLOWS_DIR } from './workflows.constants.mjs';

const slashed = (path) => path.replace(/\\/g, '/');

/**
 * @param {import('./release-layout.mjs').ReleaseLayout} layout
 * @returns {{ ci: string, release: string }} the workflow files of the app, from the repo root
 */
const workflowFilesOf = ({ app }) => (app
  ? { ci: `${WORKFLOWS_DIR}/ci-${app.name}.yml`, release: `${WORKFLOWS_DIR}/release-${app.name}.yml` }
  : { ci: CI_WORKFLOW_FILE, release: RELEASE_WORKFLOW_FILE });

/**
 * @param {string} rootDir the app root
 * @param {import('../config.mjs').BrockConfig} config
 * @param {{ manifest: Record<string, any> }[]} modules
 * @returns {{ path: string, content: string }[]} the app's workflows at the repo root, from the app root
 */
const renderWorkflows = (rootDir, config, modules) => {
  const layout = releaseLayout(rootDir, config.product);
  if (!layout) return [];
  const systemSteps = modules.flatMap((m) => m.manifest.ci ?? []);
  const { ci, release } = composeWorkflows({
    targets: config.targets ?? DEFAULT_TARGETS,
    appDir: layout.appDir,
    prefix: artifactPrefixOf(config.product),
    systemSteps,
    app: layout.app,
    baselines: config.review?.baselines === true,
  });
  const at = (file) => slashed(relative(rootDir, join(layout.repoDir, file)));
  const files = workflowFilesOf(layout);
  const shared = layout.app && layout.apps[0] === layout.appDir ? [{ path: at(CI_WORKFLOW_FILE), content: workspaceCi(systemSteps) }] : [];
  return [...shared, { path: at(files.ci), content: ci }, { path: at(files.release), content: release }];
};

export { renderWorkflows };
