/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { ProfileWizardStepBodyProps } from '@drizztdourden08/brock-react';
import type { RandomizerProfileConfig } from '../augment';
import type { RandomizerOptions } from '../randomizer-options.type';

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
  open(page: string): void;
}

interface RunPanelDef {
  id: string;
  title: string;
  span: 1 | 2 | 'full';
  Body: ComponentType<RunPanelProps>;
}

interface LogRule {
  pattern: RegExp;
  kind: string;
  tag: string;
}

type OptionsStepProps = ProfileWizardStepBodyProps<{ overrides: RandomizerOptions }>;

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
}

export type { ChecksWidgetViews, LogRule, OptionsStepProps, RandomizerSubStep, RandomizerViews, RunPanelDef, RunPanelProps };
