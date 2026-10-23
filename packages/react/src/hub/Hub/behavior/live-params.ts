/* @layer renderer-shell @kind logic */
import type { ScreenParams } from '../../../navigation/navigation.type';
import type { HubPage } from '../../hub.type';

const liveParams = (pages: readonly HubPage[], fallbacks: ReadonlyMap<string, HubPage>, params: ScreenParams): ScreenParams => {
  const section = typeof params.section === 'string' ? params.section : '';
  const fallback = fallbacks.get(section);
  if (fallback === undefined) return params;
  const key = typeof params.tab === 'string' ? params.tab : null;
  const own = pages.filter((page) => page.liveRef?.source === section);
  const target = (key === null ? own.at(0) : own.find((page) => page.liveRef?.key === key)) ?? fallback;
  return { ...params, section: target.id, tab: undefined };
};

export { liveParams };
