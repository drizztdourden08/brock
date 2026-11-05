/* @layer renderer-shell @kind logic */
import { requireHostApi } from '@drizztdourden08/brock-react';
import type { FlagParse, LaunchConnectHost, LaunchFlag } from '../launch-connect.type';

const parsedFlag = <T>(
  name: string,
  parse: (raw: string) => FlagParse<T>,
  log: LaunchConnectHost['log'],
): LaunchFlag<T> => {
  const raw = requireHostApi().startup.flags[name];
  if (raw === undefined) return { kind: 'absent' };
  const parsed = typeof raw === 'string' ? parse(raw) : null;
  if (parsed?.ok) return { kind: 'set', value: parsed.value };
  log(`--${name} refused: ${parsed === null ? 'it needs a value' : parsed.error}`, 'error');
  return { kind: 'invalid' };
};

export { parsedFlag };
