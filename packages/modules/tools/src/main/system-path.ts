/* @layer electron-main @kind logic */
import { execFile } from 'child_process';
import { join } from 'path';
import { REG_PATH_KEYS, REG_TIMEOUT_MS } from './tools-main.constants';
import { mergePathLists } from './merge-path-lists';
import { regPathValue } from './reg-path-value';

const readRegPath = (key: string, env: NodeJS.ProcessEnv): Promise<string> => new Promise((resolve) => {
  const reg = join(env.SystemRoot ?? 'C:\\Windows', 'System32', 'reg.exe');
  execFile(reg, ['query', key, '/v', 'Path'], { windowsHide: true, timeout: REG_TIMEOUT_MS }, (err, stdout) => {
    resolve(err ? '' : regPathValue(stdout, env));
  });
});

const systemPath = async (platform: NodeJS.Platform = process.platform, env: NodeJS.ProcessEnv = process.env): Promise<string> => {
  const current = env.PATH ?? '';
  if (platform !== 'win32') return current;
  const saved = await Promise.all(REG_PATH_KEYS.map((key) => readRegPath(key, env)));
  return mergePathLists([current, ...saved], ';', true);
};

export { systemPath };
