/* @layer renderer-shell @kind logic */
import { createElement, Fragment } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { contexts } from '../../contexts/contexts';
import { defineWidget } from '../../widgets/define-widget';
import { defineWidgetKit } from '../../widgets/kits/define-widget-kit';
import { registerWidgetKits } from '../../widgets/kits/register-widget-kits';
import { useWidgetKitStore } from '../../widgets/kits/useWidgetKitStore';
import { registerWidgets } from '../../widgets/register-widgets';
import { soon } from './soon';
import { OTHER_KIT_ID, OTHER_KIT_MEMBER, REVIEW_KIT_CONTEXT, REVIEW_KIT_ID, REVIEW_KIT_MEMBERS, REVIEW_KIT_OVERLAY, REVIEW_KIT_REASON } from './kit-review.constants';

const kit = defineWidgetKit({
  id: REVIEW_KIT_ID,
  label: 'Review kit',
  requires: { context: REVIEW_KIT_CONTEXT, reason: REVIEW_KIT_REASON },
  overlays: [{ id: REVIEW_KIT_OVERLAY, label: 'Review overlay', render: () => createElement(Box, { className: 'review-kit-overlay' }) }],
});

const other = defineWidgetKit({ id: OTHER_KIT_ID, label: 'Other review kit' });

const members = [
  ...REVIEW_KIT_MEMBERS.map((id, index) => defineWidget({
    id, label: `Review kit ${index + 1}`, kit: REVIEW_KIT_ID, chrome: 'compact', popOut: index === 1, defaultSide: index === 0 ? 'left' : 'right', defaultDockedSize: 220, render: () => createElement(Fragment),
  })),
  defineWidget({ id: OTHER_KIT_MEMBER, label: 'Other review kit widget', kit: OTHER_KIT_ID, defaultSide: 'right', defaultDockedSize: 220, render: () => createElement(Fragment) }),
];

const registered = (): boolean => {
  const state = useWidgetKitStore.getState();
  return [REVIEW_KIT_ID, OTHER_KIT_ID].every((id) => state.kits.some((each) => each.id === id)) && members.every((def) => state.members.some((each) => each.id === def.id));
};

const withReviewKit = async (run: () => Promise<void>): Promise<void> => {
  const removeWidgets = registerWidgets(members);
  const removeKit = registerWidgetKits([kit, other]);
  try {
    await soon(registered);
    await run();
  } finally {
    useWidgetKitStore.getState().close();
    useWidgetKitStore.getState().reset(REVIEW_KIT_ID);
    useWidgetKitStore.getState().reset(OTHER_KIT_ID);
    contexts.clear(REVIEW_KIT_CONTEXT);
    removeKit();
    removeWidgets();
  }
};

export { withReviewKit };
