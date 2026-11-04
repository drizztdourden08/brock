/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';

interface RandomizerSubStep {
  id: string;
  label: string;
  Body: ComponentType;
}

interface RandomizerViews {
  Options?: ComponentType;
  Spoiler?: ComponentType;
  runPanels?: readonly ComponentType[];
  optionsStep?: ComponentType;
  optionSubSteps?(values: Record<string, unknown>): readonly RandomizerSubStep[];
}

export type { RandomizerSubStep, RandomizerViews };
