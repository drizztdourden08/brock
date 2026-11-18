/* @layer renderer-shell @kind hook */
import { useEffect, useId, useRef } from 'react';
import { useText } from '../i18n';
import type { CommandDef, CommandInput } from './command.type';
import { commandShape } from './command-shape';
import { liveCommands } from './live-commands';
import { clearCommandGates } from './clear-command-gates';
import { setCommandGates } from './set-command-gates';
import { setCommandSource } from './set-command-source';

const useCommandSource = (rank: number, given: readonly CommandInput[]): void => {
  const text = useText();
  const defs: CommandDef[] = given.map((def) => ({ ...def, label: text(def.label) }));
  const key = useId();
  const latest = useRef(defs);
  const shape = commandShape(defs);
  useEffect(() => {
    latest.current = defs;
  });
  useEffect(() => {
    setCommandGates(key, defs);
  });
  useEffect(() => () => clearCommandGates(key), [key]);
  useEffect(() => setCommandSource(key, rank, liveCommands(shape, latest)), [key, rank, shape]);
};

export { useCommandSource };
