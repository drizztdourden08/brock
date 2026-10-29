/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { coordHome } from '../local/coord-home.mjs';

/**
 * @param {string} project the board key or the repo folder name
 * @returns {string} ~/.coord/ci/<project>, where the check-run records live
 */
const ciDir = (project) => join(coordHome(), 'ci', project);

/**
 * @param {string} project
 * @param {string} runId
 * @returns {string} the record file of a run
 */
const recordFile = (project, runId) => join(ciDir(project), `${runId}.json`);

const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'step';

/**
 * @param {string} project
 * @param {string} runId
 * @param {number} index the step's place in the run
 * @param {string} name the step's name
 * @returns {string} the log file of a step, beside the record
 */
const stepLogFile = (project, runId, index, name) => join(ciDir(project), `${runId}.${String(index + 1).padStart(2, '0')}-${slug(name)}.log`);

export { ciDir, recordFile, stepLogFile };
