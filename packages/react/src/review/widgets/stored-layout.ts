/* @layer renderer-shell @kind logic */
import { migrateLayout } from '@drizztdourden08/tessera/composites';
import type { WidgetLayout } from '@drizztdourden08/tessera/composites';
import { requireHostApi } from '../../host/require-host-api';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { readWorkspaceViews } from '../../widgets/workspaces/read-workspace-views';
import { useWorkspaceStore } from '../../widgets/workspaces/useWorkspaceStore';
import { PROFILE_VIEWS_PREFIX } from '../../widgets/widget.constants';
import type { ProfileViews } from '../../widgets/widget.type';

const liveLayoutOf = (views: ProfileViews): unknown => {
  const { active } = useWorkspaceStore.getState();
  return active === null ? views.widgetLayout : readWorkspaceViews(views.workspaces)[active]?.widgetLayout;
};

const storedLayout = async (): Promise<WidgetLayout | null> => {
  const profileId = useProfilesStore.getState().active?.id;
  if (!profileId) return null;
  const views = (await requireHostApi().loadUiViews())[`${PROFILE_VIEWS_PREFIX}${profileId}`] as ProfileViews | undefined;
  const layout = views ? liveLayoutOf(views) : undefined;
  return layout ? migrateLayout(layout) : null;
};

export { storedLayout };
