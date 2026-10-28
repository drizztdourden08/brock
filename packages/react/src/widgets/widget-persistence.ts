/* @layer renderer-shell @kind logic */
import { useWidgetPrefStore } from '../stores/useWidgetPrefStore';
import { useToolbarLayoutStore } from '../toolbars/useToolbarLayoutStore';
import type { WidgetPrefs } from '../stores/widget-pref.type';
import { forcedWidgets } from './forced-widgets';
import { forgetFocusMode } from './focus-mode';
import { useFocusModeStore } from './useFocusModeStore';
import { layoutRevision } from './layout-revision';
import { applyLayoutRevision } from './offer-layout-revision';
import { useWidgetKitStore } from './kits/useWidgetKitStore';
import { profileViews } from './profile-views';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { useWorkspaceStore } from './workspaces/useWorkspaceStore';
import { FLUSH_EVENTS } from './widget.constants';

const bound: { profileId: string | null } = { profileId: null };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const sanePrefs = (stored: unknown): WidgetPrefs =>
  (isRecord(stored) ? Object.fromEntries(Object.entries(stored).filter((entry): entry is [string, Record<string, unknown>] => isRecord(entry[1]))) : {});

const loadWidgets = async (profileId: string | null, live: () => boolean = () => true): Promise<void> => {
  bound.profileId = null;
  forgetFocusMode();
  useWorkspaceStore.getState().forget();
  if (!profileId) {
    useWidgetLayoutStore.getState().replace(null);
    useWidgetKitStore.getState().replace(null);
    useToolbarLayoutStore.getState().replace(null);
    useWorkspaceStore.getState().hydrate(null);
    forcedWidgets.rearm();
    return;
  }
  const views = await profileViews.read(profileId);
  if (!live()) return;
  useWidgetLayoutStore.getState().replace(views.widgetLayout);
  useToolbarLayoutStore.getState().replace(views.toolbarLayout);
  useWidgetKitStore.getState().replace(views.widgetKits);
  useWorkspaceStore.getState().hydrate(views.workspaces);
  forcedWidgets.rearm();
  useWidgetPrefStore.getState().hydrate(sanePrefs(views.widgetPrefs));
  bound.profileId = profileId;
  applyLayoutRevision(profileId, views, () => bound.profileId);
};

const watchWidgets = (): (() => void) => {
  const offLayout = useWidgetLayoutStore.subscribe((state, prev) => {
    const id = bound.profileId;
    if (!id || useFocusModeStore.getState().on || state.layout === prev.layout) return;
    const { active } = useWorkspaceStore.getState();
    if (active === null) void profileViews.patch(id, { widgetLayout: state.layout, ...layoutRevision.field() });
    else useWorkspaceStore.getState().put(active, { widgetLayout: state.layout, toolbarLayout: useToolbarLayoutStore.getState().layout });
  });
  const offToolbars = useToolbarLayoutStore.subscribe((state, prev) => {
    const id = bound.profileId;
    if (!id || useFocusModeStore.getState().on || state.layout === prev.layout) return;
    const { active } = useWorkspaceStore.getState();
    if (active === null) void profileViews.patch(id, { toolbarLayout: state.layout });
    else useWorkspaceStore.getState().put(active, { widgetLayout: useWidgetLayoutStore.getState().layout, toolbarLayout: state.layout });
  });
  const offWorkspaces = useWorkspaceStore.subscribe((state, prev) => {
    const id = bound.profileId;
    if (id && state.views !== prev.views) void profileViews.patch(id, { workspaces: state.views });
  });
  const offPrefs =useWidgetPrefStore.subscribe((state, prev) => {
    const id = bound.profileId;
    if (id && state.byWidget !== prev.byWidget) void profileViews.patch(id, { widgetPrefs: state.byWidget });
  });
  const offKits = useWidgetKitStore.subscribe((state, prev) => {
    const id = bound.profileId;
    if (id && state.views !== prev.views) void profileViews.patch(id, { widgetKits: state.views });
  });
  for (const name of FLUSH_EVENTS) window.addEventListener(name, profileViews.flush);
  return () => {
    offLayout();
    offToolbars();
    offPrefs();
    offKits();
    offWorkspaces();
    for (const name of FLUSH_EVENTS) window.removeEventListener(name, profileViews.flush);
    profileViews.flush();
  };
};

const widgetPersistence = { load: loadWidgets, watch: watchWidgets, boundTo: (): string | null => bound.profileId };

export { widgetPersistence };
