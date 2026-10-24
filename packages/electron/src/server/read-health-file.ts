/* @layer electron-main @kind logic */
import { readFileSync } from 'fs';
import type { HealthRecord } from './health-file.type';
import { healthFilePath } from './health-file-path';

const isRecord = (value: unknown): value is HealthRecord =>
  typeof value === 'object' && value !== null
  && typeof Reflect.get(value, 'ok') === 'boolean'
  && typeof Reflect.get(value, 'pid') === 'number'
  && typeof Reflect.get(value, 'at') === 'number';

const readHealthFile = (dataDir: string): HealthRecord | null => {
  try {
    const parsed: unknown = JSON.parse(readFileSync(healthFilePath(dataDir), 'utf-8'));
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export { readHealthFile };
