/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { ProfileWizardStepBodyProps } from '@drizztdourden08/brock-react';
import type { RandomizerModeId, RandomizerProfileConfig } from '../augment';
import type { RandomizerOptions } from '../randomizer-options.type';
import type { RuleOptionValue } from '../world/types/rule-option-value.type';
import type { RandomizerFormState } from './randomizer-form-state.type';

interface RandomizerSubStep {
  id: string;
  label: string;
  Body: ComponentType;
}

interface ChecksWidgetViews {
  context?: string;
  order?: number;
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

type OptionsStepProps = ProfileWizardStepBodyProps<{ overrides: RandomizerOptions }>;

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

type ConnectionBodies = Partial<Record<RandomizerModeId, ComponentType<ProfileWizardStepBodyProps<RandomizerFormState>>>>;

interface RandomizerViews {
  Options?: ComponentType;
  Spoiler?: ComponentType;
  Checks?: ComponentType;
  Online?: ComponentType;
  checksWidget?: ChecksWidgetViews;
  runPanels?: readonly (ComponentType | RunPanelDef)[];
  logRules?: readonly LogRule[];
  optionsStep?: ComponentType<OptionsStepProps>;
  optionSubSteps?(values: Record<string, unknown>): readonly RandomizerSubStep[];
  optionTabs?(values: Readonly<Record<string, RuleOptionValue>>): readonly OptionTab[];
  optionsAside?: ComponentType<OptionTabProps>;
  optionsAsideLabel?: string;
  connection?: ConnectionBodies;
}

export type { ChecksWidgetViews, ConnectionBodies, LogRule, OptionTab, OptionTabProps, OptionsStepProps, RandomizerSubStep, RandomizerViews, RunPanelDef, RunPanelProps };
