/* @layer tooling-scripts @kind logic */
import { stepLogFile } from './ci-paths.mjs';
import { runnerInfo } from './runner-info.mjs';
import { keyOf, runnable } from './tree-cache.mjs';

const localFields = (local) => ({
  localpkg: Boolean(local),
  ...(local ? { localBuilds: local.builds.map(({ name, version, unmerged }) => ({ build: `${name}@${version}`, unmerged: unmerged === true })) } : {}),
});

/**
 * @param {{ runId: string, request: { project: string, sha: string, tree?: string, branch: string | null, pr: string | null, trigger: string, partial: boolean, localpkg?: { builds: object[] } | null }, main: string }} input
 * @returns {object} a queued check-run record with no steps yet
 */
const newRecord = ({ runId, request, main }) => ({
  kind: 'check-run',
  id: runId,
  project: request.project,
  repo: main.replace(/\\/g, '/'),
  branch: request.branch,
  commit: request.sha,
  ...(request.tree ? { tree: request.tree } : {}),
  pr: request.pr,
  trigger: request.trigger,
  mode: 'local',
  ...localFields(request.localpkg),
  status: 'queued',
  startedAt: new Date().toISOString(),
  finishedAt: null,
  ...(request.partial ? { partial: true } : {}),
  steps: [],
  runner: runnerInfo(),
  summary: 'Queued.',
});

/**
 * @param {{ name: string, command: string, job: string, shell?: string, required: boolean, skip?: string }} planned
 * @param {{ project: string, runId: string, index: number, local?: { builds: object[] } | null }} place
 * @returns {object} the step as the record holds it
 */
const stepRecord = (planned, { project, runId, index, local = null }) => ({
  name: planned.name,
  job: planned.job,
  command: planned.command,
  ...(planned.shell ? { shell: planned.shell } : {}),
  ...(runnable(planned) ? { cacheKey: keyOf(planned, local) } : {}),
  cwd: null,
  status: planned.skip ? 'skipped-local' : 'pending',
  required: planned.required,
  startedAt: null,
  exitCode: null,
  durationMs: null,
  log: stepLogFile(project, runId, index, planned.name),
  ...(planned.skip ? { note: planned.skip } : {}),
});

export { newRecord, stepRecord };
