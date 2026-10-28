/* @layer renderer-shell @kind types */
import type { CommandDescription } from '../commands/command.type';

type DescribeLookup = (id: string) => CommandDescription;

export type { DescribeLookup };
