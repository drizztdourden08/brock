/* @layer renderer-shell @kind hook */
import { useEffect, useId, useRef } from 'react';
import type { CommandDef } from './command.type';
import { commandShape } from './command-shape';
import { liveCommands } from './live-commands';
import { setCommandSource } from './set-command-source';

const useCommandSource = (rank: number, defs: readonly CommandDef[]): void => {
  const key = useId();
  const latest = useRef(defs);
  const shape = commandShape(defs);
  useEffect(() => {
    latest.current = defs;
  });
  useEffect(() => setCommandSource(key, rank, liveCommands(shape, latest)), [key, rank, shape]);
};

export { useCommandSource };
