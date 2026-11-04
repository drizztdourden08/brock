/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';

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

interface RandomizerViews {
  Options?: ComponentType;
  Spoiler?: ComponentType;
  Checks?: ComponentType;
  checksWidget?: ChecksWidgetViews;
  runPanels?: readonly ComponentType[];
  optionsStep?: ComponentType;
  optionSubSteps?(values: Record<string, unknown>): readonly RandomizerSubStep[];
}

export type { ChecksWidgetViews, RandomizerSubStep, RandomizerViews };
