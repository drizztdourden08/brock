/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useMemo } from 'react';
import { useDeveloperTools } from '../../../app/useDeveloperTools';
import { nav } from '../../../navigation/nav';
import type { ScreenRenderContext } from '../../../screens/screen.type';
import type { HubDef, HubLiveLists, HubRenderContext, HubTarget } from '../../hub.type';
import type { HubState } from '../Hub.type';
import { useScreenStateStore } from '../../../stores/useScreenStateStore';
import { liveParams } from './live-params';
import { resolveHubPage } from './resolve-hub-page';
import { tabStateKey } from './tab-state-key';
import { useSubParent } from './useSubParent';
import { visibleHubPages } from './visible-hub-pages';
import { useShowContext } from '../../../screens/show/useShowContext';

const useHubState = (def: HubDef, ctx: ScreenRenderContext, live: HubLiveLists): HubState => {
  const { params, profile, open, close } = ctx;
  const developerTools = useDeveloperTools();
  const show = useShowContext();
  const { groups, pages, homeListed, fallbacks } = useMemo(() => visibleHubPages(def, developerTools, show, live), [def, developerTools, show, live]);
  const lastTabs = useScreenStateStore((s) => s.byScope[def.id]);
  const { page, tab, sub, subParams } = useMemo(() => resolveHubPage(pages, def.home, liveParams(pages, fallbacks, params), lastTabs), [pages, def.home, params, lastTabs, fallbacks]);
  useEffect(() => {
    if (tab !== null && lastTabs?.[tabStateKey(page.id)] !== tab.id) useScreenStateStore.getState().put(def.id, tabStateKey(page.id), tab.id);
  }, [def.id, page.id, tab, lastTabs]);
  useSubParent(sub === null ? null : page.id, params);

  const openTarget = useCallback((target: HubTarget) => {
    open(target.hub ?? def.id, { ...target.params, section: target.section, tab: target.tab });
  }, [open, def.id]);

  const context = useMemo<HubRenderContext>(
    () => ({ hub: def, page, tab, sub, subParams, params, open: openTarget, close, profile }),
    [def, page, tab, sub, subParams, params, openTarget, close, profile],
  );
  const selectPage = useCallback((id: string) => {
    const ref = pages.find((candidate) => candidate.id === id)?.liveRef;
    openTarget(ref ? { section: ref.source, tab: ref.key } : { section: id });
  }, [openTarget, pages]);
  const selectTab = useCallback((id: string) => openTarget({ section: page.id, tab: id }), [openTarget, page.id]);
  const up = useCallback(() => nav.up({ section: page.id }), [page.id]);

  return { groups, pages, homeListed, fallbacks, page, tab, sub, subParams, context, selectPage, selectTab, up };
};

export { useHubState };
