/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { getPlatform } from '../../platform/get-platform';
import { widgets } from '../../widgets/widgets';
import type { AppReviewTour } from '../app-review.type';
import { click } from '../dom/click';
import { delay } from '../dom/delay';
import { find } from '../dom/find';
import { hover } from '../dom/hover';
import { press } from '../dom/press-key';
import { settle } from '../dom/settle';
import { typeText } from '../dom/type-text';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { openScreen } from '../steps/open-screen';
import { resetUi } from '../steps/reset-ui';

const findAll = (selector: string, root: ParentNode = document): HTMLElement[] => [...root.querySelectorAll<HTMLElement>(selector)];

const openWidget = async (id: string): Promise<HTMLElement | null> => {
  widgets.open(id);
  return waitFor(() => find(`[data-widget-id="${CSS.escape(id)}"]`));
};

const appTour = (tour: StepTour, id: string): AppReviewTour => ({
  ...tour,
  id,
  capture: (name) => tour.capture(`${id}-${name}`),
  platform: getPlatform(),
  api: requireHostApi(),
  find, findAll, click, hover, typeText, press, waitFor, settle, delay, resetUi, openWidget,
  openScreen: (screen) => openScreen(tour.env, screen),
});

export { appTour };
