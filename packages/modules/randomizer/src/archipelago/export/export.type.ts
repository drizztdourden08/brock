/* @layer core @kind types */
import type { RuleNode, RuleOptionValue } from '../../world';

type LocationRequires = { always: true } | { present: string };

interface ExportedLocation {
  key: string;
  id: number;
  name: string;
  region: string;
  prize: boolean;
  requires: LocationRequires;
  rule: RuleNode;
}

interface ExportedExit {
  name: string;
  from: string;
  to: string;
  rule: RuleNode;
}

interface ExportedEvent {
  key: string;
  name: string;
  region: string;
  rule: RuleNode;
}

interface ExportedRegions {
  start: string;
  regions: { id: string; name: string }[];
  exits: ExportedExit[];
  events: ExportedEvent[];
}

type ItemClass = 'progression' | 'progression_skip_balancing' | 'useful' | 'filler';

interface ExportedItem {
  key: string;
  id: number;
  name: string;
  classification: ItemClass;
}

interface ExportedHelperCall {
  name: string;
  args: readonly (number | string | boolean)[];
  rule: RuleNode;
}

interface ExportedRules {
  primitives: Record<string, readonly string[]>;
  helpers: ExportedHelperCall[];
}

type OptionType = 'toggle' | 'choice' | 'range' | 'text' | 'dict';

interface ExportedOption {
  key: string;
  type: OptionType;
  displayName: string;
  description: string;
  default: RuleOptionValue | Record<string, never>;
  choices?: { value: string; id: number }[];
  numeric?: boolean;
  range?: { min: number; max: number };
  locked: boolean;
}

interface ApOptionDef {
  key: string;
  kind: 'toggle' | 'choice' | 'range' | 'text';
  displayName: string;
  description: string;
  baseline: RuleOptionValue;
  choices?: readonly { value: string }[];
  range?: { min: number; max: number };
  locked: boolean;
}

type WorldExport = Record<string, unknown>;

interface Readings {
  option: (key: string) => string | number | boolean;
  seed: (key: string) => string | number | boolean;
}

export type {
  ApOptionDef, ExportedEvent, ExportedExit, ExportedHelperCall, ExportedItem, ExportedLocation, ExportedOption,
  ExportedRegions, ExportedRules, ItemClass, LocationRequires, OptionType, Readings, WorldExport,
};
