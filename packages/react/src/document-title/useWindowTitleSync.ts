/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { instanceName } from '../host/instance-name';
import { usePlatform } from '../platform/usePlatform';
import { composeTitle } from './compose-title';
import { TITLE_SEPARATOR } from './document-title.constants';
import { useDocumentTitleStore } from './useDocumentTitleStore';

const useWindowTitleSync = (base: string): void => {
  const { window: win } = usePlatform();
  useEffect(() => {
    const instance = instanceName();
    const app = instance === null ? base : `${base}${TITLE_SEPARATOR}${instance}`;
    return useDocumentTitleStore.subscribe((state, previous) => {
      if (state.document !== previous.document) win.setTitle(composeTitle(app, state.document));
    });
  }, [win, base]);
};

export { useWindowTitleSync };
