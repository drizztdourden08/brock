/* @layer tooling-scripts @kind logic */
import { readYamlScalar } from '../yaml/yaml-scalar.mjs';

const JOB_ID = /^ {2}([\w-]+):\s*$/;
const SCRIPTS = /^ {6}scripts:\s*(.+)$/;
const TOP_LEVEL = /^\S/;

/**
 * @param {string} text the workflow file
 * @returns {{ id: string, scripts: string[] | null }[]}
 */
const workflowJobs = (text) => {
  const jobs = [];
  let inJobs = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^jobs:\s*$/.test(line)) inJobs = true;
    else if (inJobs && TOP_LEVEL.test(line)) break;
    else if (inJobs && JOB_ID.test(line)) jobs.push({ id: JOB_ID.exec(line)[1], scripts: null });
    else if (inJobs && jobs.length && SCRIPTS.test(line)) jobs.at(-1).scripts = readYamlScalar(SCRIPTS.exec(line)[1]).split(/\s+/).filter(Boolean);
  }
  return jobs;
};

export { workflowJobs };
