/* @layer renderer-shell @kind types */
import type { KeymapOverrides } from '@drizztdourden08/brock-core';
import type { IconName } from '@drizztdourden08/tessera/primitives';

type ChordList = string | readonly string[];

interface PlatformChords {
  mac: ChordList;
  other: ChordList;
}

type ChordInput = ChordList | PlatformChords;

interface CommandDef {
  id: string;
  label: string;
  icon?: IconName;
  group?: string;
  chord?: ChordInput;
  scope?: string;
  zone?: string;
  whileTyping?: boolean;
  when?: () => boolean;
  run: () => void;
}

type CommandData = Omit<CommandDef, 'run' | 'when'> & { gated: boolean };

interface ParsedChord {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
  key: string;
}

type HeldModifier = 'ctrl' | 'alt' | 'shift' | 'meta';

type ChordEvent =Pick<KeyboardEvent, 'key' | 'code' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>;

interface CommandConflict {
  chord: string;
  ids: readonly string[];
}

interface CommandSource {
  key: string;
  rank: number;
  defs: readonly CommandDef[];
}

interface CommandState {
  sources: readonly CommandSource[];
  overrides: KeymapOverrides;
  mac: boolean;
  persist: ((overrides: KeymapOverrides) => void) | null;
}

interface CommandLookup {
  route: string | null;
  typing: boolean;
  zones: readonly string[];
}

type ChordLookup = (id: string) => readonly string[] | undefined;

interface CommandGroup {
  title: string;
  commands: readonly CommandDef[];
}

interface CommandGroupsView {
  groups: readonly CommandGroup[];
  state: Omit<CommandState, 'persist'>;
}

interface KeymapRowInput {
  state: Omit<CommandState, 'persist'>;
  clashes: readonly CommandConflict[];
  labelOf: (id: string) => string;
}

export type {
  ChordEvent, ChordInput, ChordList, ChordLookup, CommandConflict, CommandData, CommandDef, CommandGroup, CommandGroupsView, HeldModifier, KeymapRowInput, CommandLookup, CommandState, ParsedChord, PlatformChords,
};
