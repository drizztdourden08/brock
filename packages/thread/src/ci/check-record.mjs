/* @layer tooling-scripts @kind logic */
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ciDir } from './ci-paths.mjs';

const RENAME_TRIES = 6;

const pause = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

/**
 * @param {Date} [now]
 * @returns {string} a sortable id such as 20261029T154233123Z-a3f9
 */
const newRunId = (now = new Date()) => `${now.toISOString().replace(/[-:.]/g, '')}-${randomBytes(2).toString('hex')}`;

/**
 * @param {string} file
 * @param {object} record
 * @returns {void}
 */
const writeRecord = (file, record) => {
  mkdirSync(dirname(file), { recursive: true });
  const staged = `${file}.${process.pid}.tmp`;
  writeFileSync(staged, `${JSON.stringify(record, null, 2)}\n`);
  for (let attempt = 1; ; attempt += 1) {
    try {
      renameSync(staged, file);
      return;
    } catch (error) {
      if (attempt === RENAME_TRIES) throw error;
      pause(40 * attempt);
    }
  }
};

/**
 * @param {string} project
 * @returns {object[]} every check-run record of the project, oldest first
 */
const readRecords = (project) => {
  const dir = ciDir(project);
  if (!existsSync(dir)) return [];
  const records = [];
  for (const name of readdirSync(dir).filter((entry) => entry.endsWith('.json')).sort()) {
    try {
      const record = JSON.parse(readFileSync(join(dir, name), 'utf8'));
      if (record.kind === 'check-run') records.push(record);
    } catch {
      continue;
    }
  }
  return records;
};

/**
 * @param {string} project
 * @param {string} commit a full sha
 * @returns {object | null} the newest run of that commit
 */
const latestRunFor = (project, commit) => readRecords(project).filter((record) => record.commit === commit).at(-1) ?? null;

export { latestRunFor, newRunId, readRecords, writeRecord };
