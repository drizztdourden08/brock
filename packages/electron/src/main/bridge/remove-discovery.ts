/* @layer electron-main @kind logic */
import { readFileSync, rmSync } from 'fs';
import { isRecord } from './is-record';
import { parseJson } from './parse-json';

const readSecret = (file: string): unknown => {
  try {
    const data = parseJson(readFileSync(file, 'utf8'));
    return isRecord(data) ? data.secret : null;
  } catch {
    return null;
  }
};

const removeDiscovery = (file: string, secret: string): boolean => {
  if (readSecret(file) !== secret) return false;
  rmSync(file, { force: true });
  return true;
};

export { removeDiscovery };
