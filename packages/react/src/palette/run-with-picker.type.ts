/* @layer renderer-shell @kind types */
import type { ArgValue } from '../commands/command.type';

type GivenArgs = Readonly<Record<string, ArgValue>>;

export type { GivenArgs };
