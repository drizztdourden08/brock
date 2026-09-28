/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { useWidgetPrefStore } from '../../../stores/useWidgetPrefStore';
import { profileViews } from '../../profile-views';
import { useWidgetLayoutStore } from '../../useWidgetLayoutStore';

const useWidgetPersistence = (profileId: string | null): void => {
  const hydratedFor = useRef<string | null>(null);

  useEffect(() => {
    hydratedFor.current = null;
    if (!profileId) {
      useWidgetLayoutStore.getState().replace({ widgets: [] });
      return;
    }
    let live = true;
    void profileViews.read(profileId).then((views) => {
      if (!live) return;
      useWidgetLayoutStore.getState().replace(views.widgetLayout ?? { widgets: [] });
      useWidgetPrefStore.getState().hydrate(views.widgetPrefs ?? {});
      hydratedFor.current = profileId;
    });
    return () => { live = false; };
  }, [profileId]);

  useEffect(() => {
    const offLayout = useWidgetLayoutStore.subscribe((state, prev) => {
      const id = hydratedFor.current;
      if (id && state.layout !== prev.layout) void profileViews.patch(id, { widgetLayout: state.layout });
    });
    const offPrefs = useWidgetPrefStore.subscribe((state, prev) => {
      const id = hydratedFor.current;
      if (id && state.byWidget !== prev.byWidget) void profileViews.patch(id, { widgetPrefs: state.byWidget });
    });
    window.addEventListener('beforeunload', profileViews.flush);
    return () => {
      offLayout();
      offPrefs();
      window.removeEventListener('beforeunload', profileViews.flush);
      profileViews.flush();
    };
  }, []);
};

export { useWidgetPersistence };
