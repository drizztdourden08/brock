/* @layer renderer-shell @kind logic */
import { SIZE_TOLERANCE } from '../review.constants';
import type { ControlSizeSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const allAt = (heights: readonly number[], size: number): boolean => heights.every((height) => Math.abs(height - size) <= SIZE_TOLERANCE);

const listed = (heights: readonly number[]): string => heights.map((height) => `${Math.round(height * 10) / 10} px`).join(', ');

const controlSizeChecks = (snapshot: ControlSizeSnapshot): ReviewOutcome[] => {
  const { xs, hit, sm, widgetButtons, barButtons } = snapshot;
  const widgetSize = Math.max(xs, hit);
  return [
    outcome(
      'widget-title-buttons-xs',
      widgetButtons.length > 0 && allAt(widgetButtons, widgetSize),
      `the ${widgetButtons.length} widget title bar buttons are xs, ${widgetSize} px tall (the larger of xs and the minimum hit area)`,
      widgetButtons.length === 0 ? 'the docked widget title bar shows no buttons' : `the widget title bar buttons are ${listed(widgetButtons)} tall, expected xs, ${widgetSize} px`,
    ),
    outcome(
      'title-bar-actions-sm',
      allAt(barButtons, sm),
      barButtons.length === 0 ? 'the window title bar draws no action buttons' : `the ${barButtons.length} window title bar actions are sm, ${sm} px tall`,
      `the window title bar actions are ${listed(barButtons)} tall, expected sm, ${sm} px`,
    ),
  ];
};

export { controlSizeChecks };
