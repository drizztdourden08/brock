/* @layer renderer-shell @kind logic */
import type { WidgetProbeFacts, WindowGuideMode } from '@drizztdourden08/brock-core';
import { requireHostApi } from '../../host/require-host-api';
import { until } from '../dom/until';
import type { StepTour } from '../review.type';
import { probe } from './probe';
import { MAIN_LINK } from './widget-review.constants';

const guideFacts = async (id: string, mode: WindowGuideMode | null, wanted: (facts: WidgetProbeFacts) => boolean): Promise<WidgetProbeFacts | null> => {
  const seen: { facts: WidgetProbeFacts | null } = { facts: null };
  const met = await until(async () => {
    seen.facts = (await probe({ kind: 'guide', id, mode })).facts ?? null;
    return seen.facts !== null && wanted(seen.facts);
  });
  return met ? seen.facts : null;
};

const onlyIn = (facts: WidgetProbeFacts, id: string): boolean => facts.guideIn === id && facts.guideDrawn.length === 1 && facts.guideDrawn[0] === id;

const checkCtrl = async (tour: StepTour, id: string): Promise<void> => {
  const resizing = await guideFacts(id, 'resizing', (facts) => onlyIn(facts, id) && facts.guide.mode === 'resizing' && facts.guide.snapping);
  const held = (await probe({ kind: 'modifier', ctrl: true })).facts;
  await probe({ kind: 'modifier', ctrl: false });
  const off = resizing !== null && held?.guide.snapping === false;
  tour.check('guide-ctrl', off, `resizing the "${id}" window showed the resize guide in it, and Ctrl turned snapping off`, `the resize guide did not show in the "${id}" window or did not follow Ctrl (${JSON.stringify(held?.guide)})`);
};

const checkGuide = async (tour: StepTour, id: string): Promise<void> => {
  const moving = await guideFacts(id, 'moving', (facts) => onlyIn(facts, id) && facts.guide.mode === 'moving' && facts.guide.snapping);
  await requireHostApi().reviewCaptureWidget(id, 'window-guide');
  tour.check('guide-in-moved-window', moving !== null, `moving the "${id}" window drew the guide with its commands in that window and not in the app`, `the guide did not show in the "${id}" window alone while it moved`);
  await checkCtrl(tour, id);
  const main = await guideFacts(MAIN_LINK, 'moving', (facts) => onlyIn(facts, MAIN_LINK));
  tour.check('guide-in-main', main !== null, `moving the app drew the guide in the app and closed it in the "${id}" window`, `the guide did not move to the app when the app moved`);
  await tour.capture('window-guide-main');
  const hidden = await guideFacts(MAIN_LINK, null, (facts) => facts.guideIn === null && facts.guideDrawn.length === 0);
  tour.check('guide-hides', hidden !== null, 'the guide went away when the move ended', 'the guide stayed on screen after the move ended');
};

export { checkGuide };
