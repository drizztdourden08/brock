/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { defineTour } from '../../tours/define-tour';
import { tours } from '../../tours/tours';
import type { TourDef } from '../../tours/tour.type';
import { useTourStore } from '../../tours/useTourStore';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import { widgets } from '../../widgets/widgets';
import { find } from '../dom/find';
import { settle } from '../dom/settle';
import { until } from '../dom/until';
import { waitFor } from '../dom/wait-for';
import type { StepTour } from '../review.type';
import { probe } from '../widgets/probe';
import { windowOpen } from '../widgets/window-open';
import { tourReading } from './read-tour-step';
import { POPPED_TOUR_ID, TOUR_SELECTORS, TOUR_STEP_WAIT_MS } from './tours-step.constants';

const poppedTour = (id: string): TourDef => defineTour({
  id: POPPED_TOUR_ID,
  title: 'Popped widget',
  steps: [
    { id: 'widget', title: 'In its own window', body: 'The widget is lit in its own window while this bubble stays here.', target: { widget: id }, advanceOn: { click: { widget: id } } },
    { id: 'back', title: 'Back here', body: 'The click in the widget window moved this tour on.' },
  ],
});

const spotLit = async (id: string, wanted: boolean): Promise<boolean> =>
  until(async () => (await probe({ kind: 'tourSpot', id })).facts?.tourLit === wanted);

const clickPopped = async (tour: StepTour, id: string): Promise<void> => {
  const asks = find(TOUR_SELECTORS.hint) !== null && find(TOUR_SELECTORS.primary) === null;
  tour.check('tour-popped-widget-asks', asks, 'the bubble hides Next and asks for a click on the popped widget', 'the bubble shows Next or no click hint for the popped widget');
  const selector = useTourStore.getState().spot?.selector;
  const clicked = selector !== undefined && (await probe({ kind: 'click', id, selector })).facts?.clicked === true;
  const moved = clicked && (await waitFor(() => tourReading.movedOn(POPPED_TOUR_ID, 0), TOUR_STEP_WAIT_MS)) !== null;
  tour.check('tour-popped-widget-click', moved, `a click in the "${id}" window moved the tour on in the main window`, `a click in the "${id}" window did not move the tour on`);
};

const lightPopped = async (tour: StepTour, id: string): Promise<void> => {
  tours.start(POPPED_TOUR_ID, 0);
  const shown = (await waitFor(() => tourReading.shown(POPPED_TOUR_ID, 0), TOUR_STEP_WAIT_MS)) !== null;
  const lit = shown && await spotLit(id, true);
  tour.check('tour-popped-widget-lit', lit, `a step on "${id}" lights it in its own window while the bubble stays in the main window`, `a step on the popped "${id}" did not light it in its window`);
  await settle();
  await tour.capture('tour-popped-widget-main');
  await requireHostApi().reviewCaptureWidget(id, 'tour-popped-widget');
  await clickPopped(tour, id);
  tours.stop();
  const cleared = await spotLit(id, false);
  tour.check('tour-popped-widget-cleared', cleared, `closing the tour took the spot off "${id}"`, `the spot stayed on "${id}" after the tour closed`);
};

const checkPoppedTour = async (tour: StepTour): Promise<void> => {
  const id = useWidgetLayoutStore.getState().definitions.find((def) => def.popOut === true)?.id;
  if (id === undefined) {
    tour.check('tour-popped-widget', true, 'no widget declares popOut, so no tour step lights a widget window', '');
    return;
  }
  widgets.popOut(id);
  if (!(await windowOpen(id, true))) {
    tour.check('tour-popped-widget', false, '', `"${id}" did not open in its own window`);
    return;
  }
  const list = useTourStore.getState().tours;
  useTourStore.getState().setTours([...list, poppedTour(id)]);
  await lightPopped(tour, id);
  useTourStore.getState().setTours(list);
  widgets.close(id);
  await windowOpen(id, false);
};

export { checkPoppedTour };
