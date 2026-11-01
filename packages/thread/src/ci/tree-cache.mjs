/* @layer tooling-scripts @kind logic */
import { createHash } from 'node:crypto';

const runnable = (planned) => !planned.skip && !planned.noop && !planned.upload && Boolean(planned.command);

const localPart = (local) => {
  if (!local) return '';
  const used = [...local.builds].sort((a, b) => a.name.localeCompare(b.name)).map(({ name, version, head }) => [name, version, head ?? null]);
  return `\nlocalpkg ${JSON.stringify(used)}`;
};

/**
 * @param {{ name: string, command: string, stepEnv?: object }} planned
 * @param {{ builds: { name: string, version: string, head?: string | null }[] } | null} [local] the local builds of a --localpkg run
 * @returns {string} the key of a step result inside one tree
 */
const keyOf = (planned, local = null) => createHash('sha1').update(`${planned.name}\n${planned.command}\n${JSON.stringify(planned.stepEnv ?? {})}${localPart(local)}`).digest('hex').slice(0, 16);

/**
 * @param {string} sha
 * @param {(args: string[]) => string | null} git
 * @returns {string | null} the git tree hash of the commit
 */
const treeOf = (sha, git) => git(['rev-parse', `${sha}^{tree}`]);

/**
 * @param {object[]} records check-run records, oldest first
 * @param {string} tree
 * @param {string} key
 * @returns {string | null} the run id of the newest real pass of this key in this tree
 */
const passFor = (records, tree, key) => {
  for (const record of [...records].reverse()) {
    if (record.tree !== tree) continue;
    const hit = (record.steps ?? []).find((step) => step.cacheKey === key && step.status === 'pass');
    if (hit) return hit.cachedFrom ?? record.id;
  }
  return null;
};

/**
 * Marks steps that passed for this tree.
 * Install stays when another step runs.
 * @param {{ tree?: string, steps: object[] }} record
 * @param {object[]} plan
 * @param {object[]} records
 * @returns {number} how many steps were reused
 */
const applyCache = (record, plan, records) => {
  if (!record.tree) return 0;
  const hits = plan.map((planned, index) => (runnable(planned) && record.steps[index].status === 'pending' ? passFor(records, record.tree, record.steps[index].cacheKey) : null));
  const work = plan.some((planned, index) => !hits[index] && record.steps[index].status === 'pending' && planned.name !== 'install');
  let reused = 0;
  for (const [index, from] of hits.entries()) {
    if (!from || (work && plan[index].name === 'install')) continue;
    Object.assign(record.steps[index], { status: 'pass', exitCode: 0, durationMs: 0, cachedFrom: from, note: `cached pass from ${from}` });
    reused += 1;
  }
  return reused;
};

export { applyCache, keyOf, passFor, runnable, treeOf };
