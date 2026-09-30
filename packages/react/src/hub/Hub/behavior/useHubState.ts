/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import type { ScreenRenderContext } from '../../../screens/screen.type';
import type { HubDef, HubRenderContext, HubTarget } from '../../hub.type';
import type { HubState } from '../Hub.type';
import { resolveHubPage } from './resolve-hub-page';
import { visibleHubPages } from './visible-hub-pages';

const useHubState = (def: HubDef, ctx: ScreenRenderContext): HubState => {
  const { params, profile, open, close } = ctx;
  const developerTools = useDeveloperTools();
  const { groups, pages } = useMemo(() => visibleHubPages(def, developerTools), [def, developerTools]);
  const { page, tab } = useMemo(() => resolveHubPage(pages, def.home, params), [pages, def.home, params]);

  const openTarget = useCallback((target: HubTarget) => {
    open(target.hub ?? def.id, { section: target.section, tab: target.tab });
  }, [open, def.id]);

  const context = useMemo<HubRenderContext>(
    () => ({ hub: def, page, tab, params, open: openTarget, close, profile }),
    [def, page, tab, params, openTarget, close, profile],
  );
  const selectPage = useCallback((id: string) => openTarget({ section: id }), [openTarget]);
  const selectTab = useCallback((id: string) => openTarget({ section: page.id, tab: id }), [openTarget, page.id]);

  return { groups, pages, page, tab, context, selectPage, selectTab };
};

export { useHubState };
