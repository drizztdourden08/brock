/* @layer electron-main @kind logic */
import type { RunCommand } from './updater-main.type';
import { ESTIMATED_SIZE } from './updater-main.constants';
import { parseRegValue } from './parse-reg-value';

const publishUninstallSize = async (run: RunCommand, key: string, kilobytes: number): Promise<boolean> => {
  const query = await run('reg', ['query', key, '/v', ESTIMATED_SIZE]).catch(() => null);
  if (!query) return false;
  const current = parseRegValue(query.stdout, ESTIMATED_SIZE);
  if (current?.type === 'REG_DWORD' && current.value === kilobytes) return false;
  await run('reg', ['add', key, '/v', ESTIMATED_SIZE, '/t', 'REG_DWORD', '/d', String(kilobytes), '/f']);
  return true;
};

export { publishUninstallSize };
