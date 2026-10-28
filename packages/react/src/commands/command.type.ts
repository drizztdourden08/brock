/* @layer renderer-shell @kind types */
import type { KeymapOverrides } from '@drizztdourden08/brock-core';
import type { IconName } from '@drizztdourden08/tessera/primitives';

type ChordList = string | readonly string[];

interface PlatformChords {
  mac: ChordList;
  other: ChordList;
}

type ChordInput = ChordList | PlatformChords;

type CommandTrigger = 'pointer' | 'keyboard' | 'longpress' | 'assistant';

interface CommandContext {
  point: { x: number; y: number };
  target: Element | null;
  trigger: CommandTrigger;
  data: unknown;
  args?: unknown;
  selection?: ReadonlySet<string>;
}

type ArgValue = string | number | boolean;

interface ArgOption {
  value: ArgValue;
  label: string;
}

interface ArgField {
  type: 'string' | 'number' | 'boolean';
  label?: string;
  options?: readonly ArgOption[];
  min?: number;
  max?: number;
  optional?: boolean;
}

type ArgSchema = Readonly<Record<string, ArgField>>;

interface BoundArgs {
  id: string;
  args: Readonly<Record<string, ArgValue>>;
}

type HoldCause = 'keyup' | 'blur' | 'run' | 'dispose';

interface HoldContext extends CommandContext {
  heldMs: number;
  tap: boolean;
  cause: HoldCause;
}

interface CommandHold {
  release: (context: HoldContext) => void;
  tapMs?: number;
}

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
  visible?: () => boolean;
  only?: string;
  reason?: () => string | null;
  checked?: () => boolean;
  hold?: CommandHold;
  args?: ArgSchema;
  bound?: BoundArgs;
  meta?: Readonly<Record<string, unknown>>;
  run: (context?: CommandContext) => void | Promise<void>;
}

type CommandRunResult = { ok: true } | { ok: false; why: 'unknown' | 'hidden' | 'disabled' | 'gated' | 'invalid'; reason: string };

interface CommandDescription {
  enabled: boolean;
  visible: boolean;
  reason: string | null;
  checked: boolean;
}

interface CommandBlock {
  why: 'hidden' | 'disabled' | 'gated';
  reason: string;
}

type CommandData = Omit<CommandDef, 'run' | 'when' | 'visible' | 'reason' | 'checked' | 'hold'> & {
  gated: boolean;
  hideable: boolean;
  reasoned: boolean;
  checkable: boolean;
  holdable: boolean;
  holdTapMs?: number;
};

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
  shared: readonly CommandConflict[];
  labelOf: (id: string) => string;
}

interface CommandBinding {
  id: string;
  args: Readonly<Record<string, ArgValue>>;
  chords: readonly string[];
}

export type {
  ArgField, ArgOption, ArgSchema, ArgValue, BoundArgs, ChordEvent, ChordInput, ChordList, ChordLookup, CommandBinding, CommandBlock, CommandConflict, CommandDescription, CommandHold, CommandRunResult, CommandContext, CommandData, CommandTrigger,
  CommandDef, CommandGroup, CommandGroupsView, HeldModifier, HoldCause, HoldContext, KeymapRowInput, CommandLookup, CommandState, ParsedChord, PlatformChords,
};
