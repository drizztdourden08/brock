/* @layer renderer-shell @kind logic */
import { migrateLayout } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { requireHostApi } from '../../host/require-host-api';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { PROFILE_VIEWS_PREFIX } from '../../widgets/widget.constants';
import type { ProfileViews } from '../../widgets/widget.type';

const storedLayout = async (): Promise<WidgetLayout | null> => {
  const profileId = useProfilesStore.getState().active?.id;
  if (!profileId) return null;
  const views = (await requireHostApi().loadUiViews())[`${PROFILE_VIEWS_PREFIX}${profileId}`] as ProfileViews | undefined;
  return views?.widgetLayout ? migrateLayout(views.widgetLayout) : null;
};

export { storedLayout };
