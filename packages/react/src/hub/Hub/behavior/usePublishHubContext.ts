/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { HubDef, HubRenderContext } from '../../hub.type';
import { useHubContextStore } from '../../useHubContextStore';

const usePublishHubContext = (def: HubDef, context: HubRenderContext): void => {
  const drawsHeader = def.header !== undefined;
  useEffect(() => {
    if (drawsHeader) useHubContextStore.getState().put(def.id, context);
  }, [drawsHeader, def.id, context]);
  useEffect(() => () => useHubContextStore.getState().drop(def.id), [def.id]);
};

export { usePublishHubContext };
