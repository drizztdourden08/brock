/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { ProfileWizardStepBodyProps } from '@drizztdourden08/brock-react';
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

type OptionsStepProps = ProfileWizardStepBodyProps<{ overrides: RandomizerOptions }>;

interface RandomizerViews {
  Options?: ComponentType;
  Spoiler?: ComponentType;
  Checks?: ComponentType;
  Online?: ComponentType;
  checksWidget?: ChecksWidgetViews;
  runPanels?: readonly ComponentType[];
  optionsStep?: ComponentType<OptionsStepProps>;
  optionSubSteps?(values: Record<string, unknown>): readonly RandomizerSubStep[];
}

export type { ChecksWidgetViews, OptionsStepProps, RandomizerSubStep, RandomizerViews };
