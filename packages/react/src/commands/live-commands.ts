/* @layer renderer-shell @kind logic */
import type { RefObject } from 'react';
import type { CommandData, CommandDef } from './command.type';

const liveCommands = (shape: string, latest: RefObject<readonly CommandDef[]>): CommandDef[] => {
  const current = (id: string): CommandDef | undefined => latest.current.find((def) => def.id === id);
  return (JSON.parse(shape) as CommandData[]).map(({ gated, ...data }) => ({
    ...data,
    run: () => current(data.id)?.run(),
    ...(gated ? { when: () => current(data.id)?.when?.() !== false } : {}),
  }));
};

export { liveCommands };
