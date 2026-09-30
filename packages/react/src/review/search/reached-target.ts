/* @layer renderer-shell @kind logic */
import { resolveRoute } from '../../navigation/resolve-route';
import { routeAliases } from '../../navigation/route-aliases';
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { ANCHOR_ATTRIBUTES } from '../../search/search.constants';
import { widgets } from '../../widgets/widgets';
import { waitFor } from '../dom/wait-for';
import { SEARCH_HIT_CLASS } from '../review.constants';
import type { SearchSample } from '../review.type';

const atRoute = (route: string): boolean => {
  const want = resolveRoute(route, {}, routeAliases.get);
  const { active, params } = useNavigationStore.getState();
  const section = want.params.section === undefined || params.section === want.params.section;
  const tab = want.params.tab === undefined || params.tab === want.params.tab;
  return active === want.active && section && tab;
};

const flashed = (anchor: string): boolean =>
  [...document.querySelectorAll<HTMLElement>(`.${SEARCH_HIT_CLASS}`)].some((element) => ANCHOR_ATTRIBUTES.some((name) => element.getAttribute(name) === anchor));

const reachedTarget = async (sample: SearchSample): Promise<boolean> => {
  const { widget, target } = sample;
  if (widget !== undefined) return (await waitFor(() => widgets.isVisible(widget))) !== null;
  if (target === undefined || (await waitFor(() => atRoute(target.route))) === null) return false;
  const { anchor } = target;
  return anchor === undefined || (await waitFor(() => flashed(anchor))) !== null;
};

export { reachedTarget };
