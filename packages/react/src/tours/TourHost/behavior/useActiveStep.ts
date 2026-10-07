/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import { useWidgetLayoutStore } from '../../../widgets/useWidgetLayoutStore';
import { nextOnStuck } from '../../next-on-stuck';
import { stuckClickStep } from '../../stuck-click-step';
import { toGuidedSteps } from '../../to-guided-steps';
import { useTourStore } from '../../useTourStore';
import { NO_STEPS } from '../TourHost.constants';

const useActiveStep = () => {
  const list = useTourStore((s) => s.tours);
  const active = useTourStore((s) => s.active);
  const shown = useTourStore((s) => s.shown);
  const popped = useWidgetLayoutStore((s) => s.layout.popped);
  const clickHint = useTesseraStrings().tour.clickToGo;
  const def = active ? list.find((tour) => tour.id === active.id) ?? null : null;
  const step = def && active ? def.steps[active.index] ?? null : null;
  const stuck = stuckClickStep(def, shown);
  const guided = useMemo(() => (def ? toGuidedSteps(def, clickHint) : NO_STEPS), [def, popped, clickHint]);
  const steps = useMemo(() => nextOnStuck(guided, stuck), [guided, stuck]);
  const key = def && active ? `${def.id}:${active.index}` : '';
  return { list, def, step, steps, index: active?.index ?? 0, key, popped };
};

export { useActiveStep };
