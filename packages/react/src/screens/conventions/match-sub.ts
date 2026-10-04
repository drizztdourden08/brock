/* @layer renderer-shell @kind logic */
import type { HubSubPage } from '../../hub/hub.type';
import { PARAM_PREFIX, ROUTE_SEPARATOR } from '../../navigation/navigation.constants';
import type { SubMatch } from './screen-tree.type';

const matchOne = (sub: HubSubPage, parts: readonly string[]): SubMatch | null => {
  const pattern = sub.path.split(ROUTE_SEPARATOR);
  if (pattern.length !== parts.length) return null;
  const params: Record<string, string> = {};
  for (const [index, want] of pattern.entries()) {
    const got = parts[index] ?? '';
    if (want.startsWith(PARAM_PREFIX) && got !== '') params[want.slice(PARAM_PREFIX.length)] = decodeURIComponent(got);
    else if (want !== got) return null;
  }
  return { sub, params };
};

const matchSub = (subs: readonly HubSubPage[], rest: string): SubMatch | null => {
  const parts = rest.split(ROUTE_SEPARATOR);
  for (const sub of subs) {
    const found = matchOne(sub, parts);
    if (found) return found;
  }
  return null;
};

export { matchSub };
