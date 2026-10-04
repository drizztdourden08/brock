/* @layer tooling-scripts @kind logic */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { jsonFile } from '../provision/json-file.mjs';
import { renderReport } from './render-report.mjs';
import { MIGRATIONS_FILE, REPORT_FILE } from './upgrade.constants.mjs';

const writeReport = (head, outcome, changelog, entry) => {
  const migrations = jsonFile(join(entry.dir, MIGRATIONS_FILE)).read();
  const app = entry.label === '.' ? head.app : `${head.app} (${entry.label})`;
  const report = renderReport({ app, plan: { ...head.plan, current: entry.from }, worktree: head.worktree }, outcome, { migrations, changelog });
  const path = join(entry.dir, REPORT_FILE);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, report, 'utf8');
  return path;
};

/**
 * @param {{ app: string, plan: import('./upgrade.type.mjs').UpgradePlan, worktree: { path: string, branch: string }, apps: import('./upgrade.type.mjs').UpgradeApp[] }} head
 * @param {{ fields: string[], steps: import('./upgrade.type.mjs').StepResult[], failed: string | null }} outcome
 * @param {{ version: string, entries: string[] }[]} changelog
 * @returns {string[]} the upgrade-report.md written in each app, absolute
 */
const writeReports = (head, outcome, changelog) => head.apps.map((entry) => writeReport(head, outcome, changelog, entry));

export { writeReports };
