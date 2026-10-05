/* @layer renderer-shell @kind logic */
import { contexts } from '../contexts/contexts';
import { nav } from '../navigation/nav';
import { useProfilesStore } from '../stores/useProfilesStore';
import { widgets } from '../widgets/widgets';
import type { TourContextChange, TourStepContext, TourStepDef } from './tour.type';

const openWidget = (id: string): void => {
  if (!widgets.isVisible(id)) widgets.open(id);
};

const contextChange = (context: string | TourContextChange): TourContextChange =>
  (typeof context === 'string' ? { name: context } : context);

const stepContext = (tourId: string, step: TourStepDef, index: number, signal: AbortSignal): TourStepContext => ({
  tourId,
  stepId: step.id,
  index,
  profileId: useProfilesStore.getState().active?.id ?? null,
  signal,
  open: nav.open,
  close: nav.close,
  openWidget,
  setContext: contexts.set,
});

const prepareStep = async (tourId: string, step: TourStepDef, index: number, signal: AbortSignal): Promise<void> => {
  if (signal.aborted) return;
  if (step.open) nav.open(step.open);
  if (step.widget) openWidget(step.widget);
  if (step.context) {
    const { name, active = true, data } = contextChange(step.context);
    contexts.set(name, data === undefined ? { active } : { active, data });
  }
  await step.before?.(stepContext(tourId, step, index, signal));
};

export { prepareStep };
