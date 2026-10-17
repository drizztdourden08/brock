/* @layer renderer-shell @kind logic */
import { useWidgetKitStore } from '../../widgets/kits/useWidgetKitStore';
import { widgets } from '../../widgets/widgets';
import { waitFor } from '../dom/wait-for';
import { find } from '../dom/find';
import type { ReviewStep } from '../review.type';
import { checkDeveloperMenu } from '../widgets/developer-menu-check';
import { checkKitExclusive } from '../widgets/kit-exclusive-check';
import { checkKitGate } from '../widgets/kit-gate-check';
import { checkKitLayout } from '../widgets/kit-layout-check';
import { checkKitMixing } from '../widgets/kit-mixing-check';
import { checkKitPopOut } from '../widgets/kit-pop-out-check';
import { KIT_NORMAL_WIDGET, REVIEW_KIT_ID, kitSelectors } from '../widgets/kit-review.constants';
import { checkKitTogether } from '../widgets/kit-together-check';
import { withReviewKit } from '../widgets/with-review-kit';
import { reviewAppKit } from './review-app-kit';

const kitsStep: ReviewStep = {
  name: 'kits',
  run: async (tour) => {
    const normalOpen = widgets.isVisible(KIT_NORMAL_WIDGET);
    widgets.open(KIT_NORMAL_WIDGET);
    await waitFor(() => find(kitSelectors.widget(KIT_NORMAL_WIDGET)));
    try {
      await withReviewKit(async () => {
        await checkKitGate(tour);
        await checkKitMixing(tour);
        await checkKitExclusive(tour);
        await checkKitPopOut(tour);
        await checkKitLayout(tour);
        await checkKitTogether(tour);
      });
    } finally {
      if (!normalOpen) widgets.close(KIT_NORMAL_WIDGET);
    }
    await checkDeveloperMenu(tour);
    const own = useWidgetKitStore.getState().kits.filter((kit) => kit.id !== REVIEW_KIT_ID);
    for (const kit of own) await reviewAppKit(tour, kit);
  },
};

export { kitsStep };
