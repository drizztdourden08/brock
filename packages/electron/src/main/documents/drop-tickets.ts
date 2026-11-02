/* @layer electron-main @kind logic */
import { DROP_TICKET_LIMIT, DROP_TICKET_TTL_MS } from './drop-tickets.constants';
import type { DropTickets } from './drop-tickets.type';

const createDropTickets = (now: () => number = Date.now): DropTickets => {
  const live = new Map<number, Map<string, number>>();

  const liveOf = (sender: number): Map<string, number> | undefined => {
    const paths = live.get(sender);
    if (!paths) return undefined;
    for (const [path, expiry] of paths) if (expiry <= now()) paths.delete(path);
    if (paths.size > 0) return paths;
    live.delete(sender);
    return undefined;
  };

  const issue = (sender: number, paths: readonly string[]): void => {
    const held = liveOf(sender) ?? new Map<string, number>();
    for (const path of paths) {
      if (path === '') continue;
      if (held.size >= DROP_TICKET_LIMIT && !held.has(path)) break;
      held.set(path, now() + DROP_TICKET_TTL_MS);
    }
    if (held.size > 0) live.set(sender, held);
  };

  const take = (sender: number, path: string): boolean => liveOf(sender)?.delete(path) ?? false;

  const has = (sender: number): boolean => liveOf(sender) !== undefined;

  const forget = (sender: number): void => {
    live.delete(sender);
  };

  return { issue, take, has, forget };
};

export { createDropTickets };
