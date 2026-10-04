/* @layer electron-main @kind logic */
import { clusterOf } from './cluster-of';
import type { MoveSession } from './widget-windows.type';

let current: MoveSession | null = null;

const begin = (id: string): MoveSession => {
  if (current?.id === id) return current;
  current = { id, members: new Set(clusterOf(id)), hit: null, grab: null };
  return current;
};

const end = (id: string): MoveSession | null => {
  if (current?.id !== id) return null;
  const done = current;
  current = null;
  return done;
};

const moveSession = { begin, end, of: (id: string): MoveSession | null => (current?.id === id ? current : null) };

export { moveSession };
