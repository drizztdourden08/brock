/* @layer tooling-scripts @kind logic */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { stampOf, treeStamp } from '../build-reuse/file-stamp.mjs';
import { BRAND_RECORD_FILE, BRAND_RECORD_VERSION } from './freshness.constants.mjs';

const INPUT_FILES = ['brock.config.ts', 'package.json', 'node_modules/.modules.yaml'];

const lockfileOf = (appDir) => {
  for (let dir = appDir; ; dir = dirname(dir)) {
    const path = join(dir, 'pnpm-lock.yaml');
    if (stampOf(path) !== null || dirname(dir) === dir) return path;
  }
};

const inputStamps = (appDir) => Object.fromEntries([...INPUT_FILES.map((name) => join(appDir, name)), lockfileOf(appDir)].map((path) => [path, stampOf(path)]));

const readRecord = (appDir) => {
  try {
    const record = JSON.parse(readFileSync(join(appDir, BRAND_RECORD_FILE), 'utf8'));
    return record?.version === BRAND_RECORD_VERSION ? record : null;
  } catch {
    return null;
  }
};

const sameStamps = (recorded, current) => Object.entries(current).every(([path, stamp]) => recorded?.[path] === stamp);

/**
 * @param {string} appDir
 * @returns {boolean} true while the last brand copy still holds
 */
const brandIconsCurrent = (appDir) => {
  const record = readRecord(appDir);
  if (!record || !sameStamps(record.inputs, inputStamps(appDir))) return false;
  if (record.brandDir && treeStamp(record.brandDir) !== record.brandTree) return false;
  return Object.entries(record.outputs ?? {}).every(([path, stamp]) => stampOf(join(appDir, path)) === stamp);
};

/**
 * @param {string} appDir
 * @param {{ brandDir: string, written: string[], current: string[] } | null} copied what copyBrandIcons returned
 * @returns {boolean} whether the record was written
 */
const writeBrandRecord = (appDir, copied) => {
  const outputs = copied ? Object.fromEntries([...copied.written, ...copied.current].map((path) => [path, stampOf(join(appDir, path))])) : {};
  const record = { version: BRAND_RECORD_VERSION, inputs: inputStamps(appDir), brandDir: copied?.brandDir ?? null, brandTree: copied ? treeStamp(copied.brandDir) : null, outputs };
  try {
    mkdirSync(dirname(join(appDir, BRAND_RECORD_FILE)), { recursive: true });
    writeFileSync(join(appDir, BRAND_RECORD_FILE), JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
};

export { brandIconsCurrent, writeBrandRecord };
