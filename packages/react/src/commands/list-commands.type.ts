/* @layer renderer-shell @kind types */
import type { CommandState } from './command.type';

type ListState = Pick<CommandState, 'sources' | 'overrides' | 'mac'>;

export type { ListState };
