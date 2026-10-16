/* @layer renderer-shell @kind logic */
import { showsHubNav } from '../../hub/Hub/behavior/shows-hub-nav';
import { visibleHubPages } from '../../hub/Hub/behavior/visible-hub-pages';
import { ROUTE_SEPARATOR } from '../../navigation/navigation.constants';
import type { ReviewEnv, SearchSample } from '../review.type';

const hasHubSearch = (env: ReviewEnv, sample: SearchSample): boolean => {
  const bucket = sample.target?.route.split(ROUTE_SEPARATOR)[0];
  const hub = env.screenTree?.hubs.find((candidate) => candidate.id === bucket);
  return hub !== undefined && showsHubNav(hub.nav, visibleHubPages(hub, env.developerTools).pages.length);
};

const hubSearchSample = (env: ReviewEnv, samples: readonly SearchSample[]): SearchSample | undefined =>
  samples.find((sample) => sample.source.startsWith('setting') && hasHubSearch(env, sample));

export { hubSearchSample };
