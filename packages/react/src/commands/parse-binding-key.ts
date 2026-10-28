/* @layer renderer-shell @kind logic */
import type { BoundArgs } from './command.type';
import { BIND_SEPARATOR } from './commands.constants';

const parseBindingKey = (key: string): BoundArgs | null => {
  const at = key.indexOf(BIND_SEPARATOR);
  if (at <= 0) return null;
  try {
    const args = JSON.parse(key.slice(at + 1)) as unknown;
    return args !== null && typeof args === 'object' && !Array.isArray(args) ? { id: key.slice(0, at), args: args as BoundArgs['args'] } : null;
  } catch {
    return null;
  }
};

export { parseBindingKey };
