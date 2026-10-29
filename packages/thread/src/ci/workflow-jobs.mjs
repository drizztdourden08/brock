/* @layer tooling-scripts @kind logic */
import { parse } from 'yaml';

const asList = (value) => {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
};

const text = (value) => (value === undefined || value === null ? null : String(value));

const plainObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

const stringValues = (value) => Object.fromEntries(Object.entries(plainObject(value)).map(([key, entry]) => [key, String(entry)]));

const stepOf = (raw) => ({
  name: text(raw.name),
  if: text(raw.if),
  uses: text(raw.uses),
  run: text(raw.run),
  shell: text(raw.shell),
  workdir: text(raw['working-directory']),
  env: stringValues(raw.env),
  with: stringValues(raw.with),
});

const scriptsOf = (raw) => {
  const scripts = raw.uses ? raw.with?.scripts : null;
  return typeof scripts === 'string' ? scripts.split(/\s+/).filter(Boolean) : null;
};

const jobOf = (id, raw) => ({
  id,
  scripts: scriptsOf(raw),
  uses: text(raw.uses),
  needs: asList(raw.needs).map(String),
  if: text(raw.if),
  runsOn: raw['runs-on'] ?? null,
  env: stringValues(raw.env),
  shell: text(raw.defaults?.run?.shell),
  workdir: text(raw.defaults?.run?.['working-directory']),
  matrix: raw.strategy?.matrix ?? null,
  steps: asList(raw.steps).map((step) => stepOf(plainObject(step))),
});

/**
 * @param {string} source the workflow file
 * @returns {{ env: Record<string, string>, shell: string | null, workdir: string | null, jobs: object[] }} the workflow as the runner reads it, jobs in file order
 */
const readWorkflow = (source) => {
  const document = plainObject(parse(source));
  return {
    env: stringValues(document.env),
    shell: text(document.defaults?.run?.shell),
    workdir: text(document.defaults?.run?.['working-directory']),
    jobs: Object.entries(plainObject(document.jobs)).map(([id, raw]) => jobOf(id, plainObject(raw))),
  };
};

/**
 * @param {{ id: string, needs: string[] }[]} jobs
 * @returns {object[]} the jobs, each after the jobs it needs
 */
const inNeedsOrder = (jobs) => {
  const ordered = [];
  const visiting = new Set();
  const visit = (job) => {
    if (ordered.includes(job)) return;
    if (visiting.has(job.id)) throw new Error(`The jobs of the workflow need each other in a circle at "${job.id}".`);
    visiting.add(job.id);
    for (const need of job.needs) {
      const wanted = jobs.find((other) => other.id === need);
      if (wanted) visit(wanted);
    }
    visiting.delete(job.id);
    ordered.push(job);
  };
  for (const job of jobs) visit(job);
  return ordered;
};

export { inNeedsOrder, readWorkflow };
