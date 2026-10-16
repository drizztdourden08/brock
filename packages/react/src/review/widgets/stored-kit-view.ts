/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { readKitViews } from '../../widgets/kits/read-kit-views';
import type { KitView } from '../../widgets/kits/widget-kit.type';
import { PROFILE_VIEWS_PREFIX } from '../../widgets/widget.constants';
import type { ProfileViews } from '../../widgets/widget.type';

const storedKitView = async (kit: string): Promise<KitView | null> => {
  const profileId = useProfilesStore.getState().active?.id;
  if (!profileId) return null;
  const views = (await requireHostApi().loadUiViews())[`${PROFILE_VIEWS_PREFIX}${profileId}`] as ProfileViews | undefined;
  return readKitViews(views?.widgetKits)[kit] ?? null;
};

export { storedKitView };
