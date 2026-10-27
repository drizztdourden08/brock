/* @layer renderer-shell @kind logic */
import { toast } from '../toast';
import { layoutRevision } from './layout-revision';
import { profileViews } from './profile-views';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { REVISION_OFFER_MESSAGE, REVISION_RESET_LABEL } from './widget.constants';
import type { RevisionOffer } from './offer-layout-revision.type';
import type { ProfileViews } from './widget.type';

const keepMine = ({ profileId, target, boundTo }: RevisionOffer): void => {
  if (boundTo() === profileId) layoutRevision.adopt(target);
  void profileViews.patch(profileId, { widgetLayoutRevision: target });
};

const offerLayoutRevision = (offer: RevisionOffer): void => {
  toast(REVISION_OFFER_MESSAGE, {
    variant: 'info',
    duration: 0,
    action: { label: REVISION_RESET_LABEL, onSelect: () => { if (offer.boundTo() === offer.profileId) useWidgetLayoutStore.getState().reset(); } },
    onClose: (reason) => { if (reason === 'dismissed') keepMine(offer); },
  });
};

const applyLayoutRevision = (profileId: string, views: ProfileViews, boundTo: () => string | null): void => {
  const { preset } = useWidgetLayoutStore.getState();
  const target = layoutRevision.ofPreset(preset);
  const hasSaved = views.widgetLayout !== undefined && views.widgetLayout !== null;
  const saved = hasSaved ? layoutRevision.stored(views.widgetLayoutRevision) ?? 1 : target;
  layoutRevision.start(saved);
  if (!hasSaved || target === undefined || saved === undefined || target <= saved) return;
  if (preset?.onRevision === 'apply') useWidgetLayoutStore.getState().reset();
  else offerLayoutRevision({ profileId, target, boundTo });
};

export { applyLayoutRevision };
