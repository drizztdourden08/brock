/* @layer renderer-shell @kind logic */
import { createElement, Fragment } from 'react';
import { defineWidget } from '../../widgets/define-widget';
import { registerWidgets } from '../../widgets/register-widgets';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import type { WidgetInput } from '../../widgets/widget.type';
import { until } from '../dom/until';
import { poppedWindowOf } from '../steps/popped-window-of';
import { soon } from './soon';

const withReviewWidget = async (input: Omit<WidgetInput, 'render'>, run: (id: string) => Promise<void>): Promise<void> => {
  const remove = registerWidgets([defineWidget({ ...input, render: () => createElement(Fragment) })]);
  try {
    await soon(() => useWidgetLayoutStore.getState().definitions.some((def) => def.id === input.id));
    await run(input.id);
  } finally {
    widgets.close(input.id);
    await until(async () => (await poppedWindowOf(input.id)) === null);
    remove();
  }
};

export { withReviewWidget };
