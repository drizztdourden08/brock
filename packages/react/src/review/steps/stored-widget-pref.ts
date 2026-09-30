/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { PROFILE_VIEWS_PREFIX } from '../../widgets/widget.constants';
import type { ProfileViews } from '../../widgets/widget.type';

const storedWidgetPref = async (id: string, key: string): Promise<unknown> => {
  const profileId = useProfilesStore.getState().active?.id;
  if (!profileId) return undefined;
  const views = (await requireHostApi().loadUiViews())[`${PROFILE_VIEWS_PREFIX}${profileId}`] as ProfileViews | undefined;
  return views?.widgetPrefs?.[id]?.[key];
};

export { storedWidgetPref };
