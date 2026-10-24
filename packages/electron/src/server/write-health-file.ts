/* @layer electron-main @kind logic */
import { mkdirSync, renameSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import type { HealthRecord } from './health-file.type';
import { healthFilePath } from './health-file-path';

const writeHealthFile = (dataDir: string, record: HealthRecord): void => {
  const target = healthFilePath(dataDir);
  const staged = `${target}.${record.pid}.tmp`;
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(staged, JSON.stringify(record), 'utf-8');
  renameSync(staged, target);
};

export { writeHealthFile };
