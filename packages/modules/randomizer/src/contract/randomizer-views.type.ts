/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { RandomizerModeId, RandomizerProfileConfig } from '../augment';
import type { RandomizerOptions } from '../randomizer-options.type';
import type { RuleOptionValue } from '../world/types/rule-option-value.type';
import type { ConnectionBody, ConnectionView } from './connection-view.type';
import type { WidgetSlot } from './widget-slot.type';

interface ChecksWidgetViews extends WidgetSlot {
  settings?: ComponentType;
}

interface RunPanelProps {
  config: RandomizerProfileConfig;
  mode: RandomizerModeId;
  romFile: string | null;
  open(page: string): void;
}

interface RunPanelDef {
  id: string;
  title: string;
  span: 1 | 2 | 'full';
  Body: ComponentType<RunPanelProps>;
  actions?: ComponentType<RunPanelProps>;
}

interface LogRule {
  pattern: RegExp;
  kind: string;
  tag: string;
}

interface OptionTabProps {
  values: Readonly<Record<string, RuleOptionValue>>;
  overrides: RandomizerOptions;
  onChange?(next: RandomizerOptions): void;
  frozen: boolean;
  seed: string;
  mode: RandomizerModeId;
  romFile: string | null;
}

interface OptionTab {
  id: string;
  label: string;
  keys?: readonly string[];
  Body?: ComponentType<OptionTabProps>;
}

type ConnectionBodies = Partial<Record<RandomizerModeId, ConnectionBody | ConnectionView>>;

interface RandomizerViews {
  Options?: ComponentType;
  Spoiler?: ComponentType;
  Checks?: ComponentType;
  Online?: ComponentType;
  checksWidget?: ChecksWidgetViews;
  runPanels?: readonly (ComponentType | RunPanelDef)[];
  logRules?: readonly LogRule[];
  optionTabs?(values: Readonly<Record<string, RuleOptionValue>>): readonly OptionTab[];
  optionsAside?: ComponentType<OptionTabProps>;
  optionsAsideLabel?: string;
  connection?: ConnectionBodies;
}

export type { ChecksWidgetViews, ConnectionBodies, LogRule, OptionTab, OptionTabProps, RandomizerViews, RunPanelDef, RunPanelProps };
