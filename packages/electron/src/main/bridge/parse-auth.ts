/* @layer electron-main @kind logic */
import { isRecord } from './is-record';
import { parseJson } from './parse-json';

const parseAuth = (line: string): string | null => {
  const data = parseJson(line);
  return isRecord(data) && typeof data.auth === 'string' ? data.auth : null;
};

export { parseAuth };
