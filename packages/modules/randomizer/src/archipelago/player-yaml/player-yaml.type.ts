/* @layer core @kind types */
import type { ExportedOption } from '../export';

interface PlayerYamlInput {
  game: string;
  slotName: string;
  appVersion?: string;
  schemaRows: readonly ExportedOption[];
  values: Readonly<Record<string, unknown>>;
  seedText?: string;
  deathLink?: boolean;
  preRolled?: Record<string, unknown>;
  block?: (block: Record<string, unknown>) => Record<string, unknown>;
}

type PlayerFileInput = Omit<PlayerYamlInput, 'slotName'> & { slotName?: string };

interface PlayerFile {
  slotName: string;
  yaml: string;
}

export type { PlayerFile, PlayerFileInput, PlayerYamlInput };
