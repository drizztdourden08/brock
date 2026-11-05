/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { ProfileWizardStepBodyProps } from '@drizztdourden08/brock-react';
import type { RandomizerModeId } from '../augment';
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

type OptionsStepProps = ProfileWizardStepBodyProps<{ overrides: RandomizerOptions }>;

interface OptionTabProps {
  values: Readonly<Record<string, RuleOptionValue>>;
  overrides: RandomizerOptions;
  onChange?(next: RandomizerOptions): void;
  frozen: boolean;
  seed: string;
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
  runPanels?: readonly ComponentType[];
  optionsStep?: ComponentType<OptionsStepProps>;
  optionSubSteps?(values: Record<string, unknown>): readonly RandomizerSubStep[];
  optionTabs?(values: Readonly<Record<string, RuleOptionValue>>): readonly OptionTab[];
  optionsAside?: ComponentType<OptionTabProps>;
  connection?: ConnectionBodies;
}

export type { ChecksWidgetViews, ConnectionBodies, OptionTab, OptionTabProps, OptionsStepProps, RandomizerSubStep, RandomizerViews };
