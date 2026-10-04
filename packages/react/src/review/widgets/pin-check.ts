/* @layer renderer-shell @kind logic */
import type { WidgetPinMode } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';
import { settle } from '../dom/settle';
import { until } from '../dom/until';
import type { StepTour } from '../review.type';

const pinTo = async (id: string, mode: WidgetPinMode): Promise<boolean> => {
  const api = requireHostApi();
  const answer = await api.setWidgetPin(id, mode);
  return answer === mode && until(async () => (await api.getWidgetWindowState(id))?.onTop === (mode === 'top'));
};

const checkPin = async (tour: StepTour, id: string): Promise<void> => {
  const top = await pinTo(id, 'top');
  tour.check('widget-pin-top', top, `choosing "Always on top" kept the "${id}" window above the others`, `the "${id}" window did not go on top when pinned`);
  await settle();
  await requireHostApi().reviewCaptureWidget(id, 'widget-window-on-top');
  const off = await pinTo(id, 'off');
  tour.check('widget-pin-off', off, `choosing "Normal window" let the "${id}" window stack normally again`, `the "${id}" window stayed on top after unpinning`);
};

export { checkPin };
