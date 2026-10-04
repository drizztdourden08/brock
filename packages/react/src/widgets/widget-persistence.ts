/* @layer renderer-shell @kind logic */
import { useWidgetPrefStore } from '../stores/useWidgetPrefStore';
import type { WidgetPrefs } from '../stores/widget-pref.type';
import { profileViews } from './profile-views';
import { useWidgetLayoutStore } from './useWidgetLayoutStore';
import { FLUSH_EVENTS } from './widget.constants';

const bound: { profileId: string | null } = { profileId: null };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const sanePrefs = (stored: unknown): WidgetPrefs =>
  (isRecord(stored) ? Object.fromEntries(Object.entries(stored).filter((entry): entry is [string, Record<string, unknown>] => isRecord(entry[1]))) : {});

const loadWidgets = async (profileId: string | null, live: () => boolean = () => true): Promise<void> => {
  bound.profileId = null;
  if (!profileId) {
    useWidgetLayoutStore.getState().replace(null);
    return;
  }
  const views = await profileViews.read(profileId);
  if (!live()) return;
  useWidgetLayoutStore.getState().replace(views.widgetLayout);
  useWidgetPrefStore.getState().hydrate(sanePrefs(views.widgetPrefs));
  bound.profileId = profileId;
};

const watchWidgets = (): (() => void) => {
  const offLayout = useWidgetLayoutStore.subscribe((state, prev) => {
    const id = bound.profileId;
    if (id && state.layout !== prev.layout) void profileViews.patch(id, { widgetLayout: state.layout });
  });
  const offPrefs = useWidgetPrefStore.subscribe((state, prev) => {
    const id = bound.profileId;
    if (id && state.byWidget !== prev.byWidget) void profileViews.patch(id, { widgetPrefs: state.byWidget });
  });
  for (const name of FLUSH_EVENTS) window.addEventListener(name, profileViews.flush);
  return () => {
    offLayout();
    offPrefs();
    for (const name of FLUSH_EVENTS) window.removeEventListener(name, profileViews.flush);
    profileViews.flush();
  };
};

const widgetPersistence = { load: loadWidgets, watch: watchWidgets, boundTo: (): string | null => bound.profileId };

export { widgetPersistence };
