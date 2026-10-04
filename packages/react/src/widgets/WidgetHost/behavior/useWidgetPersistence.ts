/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { widgetPersistence } from '../../widget-persistence';

const useWidgetPersistence = (profileId: string | null): void => {
  useEffect(() => {
    let live = true;
    void widgetPersistence.load(profileId, () => live);
    return () => { live = false; };
  }, [profileId]);

  useEffect(widgetPersistence.watch, []);
};

export { useWidgetPersistence };
