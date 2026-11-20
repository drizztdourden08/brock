/* @layer electron-main @kind logic */
import type { ClipboardOwner, WatchOwners } from './clipboard-watch.type';

const watchOwners = (max: number): WatchOwners => {
  const owners = new Map<ClipboardOwner, Set<string>>();

  const size = (): number => [...owners.values()].reduce((sum, ids) => sum + ids.size, 0);

  return {
    add: (owner, id) => {
      const ids = owners.get(owner) ?? new Set<string>();
      if (ids.has(id)) return;
      if (size() >= max) throw new Error(`At most ${max} clipboard watchers can be open`);
      ids.add(id);
      owners.set(owner, ids);
    },
    remove: (owner, id) => {
      const ids = owners.get(owner);
      ids?.delete(id);
      if (ids?.size === 0) owners.delete(owner);
    },
    drop: (owner) => {
      owners.delete(owner);
    },
    prune: () => {
      for (const owner of [...owners.keys()]) if (owner.isDestroyed()) owners.delete(owner);
    },
    tell: (channel) => {
      for (const owner of owners.keys()) owner.send(channel);
    },
    empty: () => owners.size === 0,
    size,
  };
};

export { watchOwners };
