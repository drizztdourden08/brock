/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { UpdateFeed } from './update-feed.type';
import {
  API_ORIGIN_SUFFIX, CHANNEL_BY_PLATFORM, GITHUB_API, GITHUB_WEB, UPDATE_SOURCE_FLAG,
} from './updater-main.constants';

const channelOf = (explicit: string | undefined): string =>
  explicit ?? CHANNEL_BY_PLATFORM[process.platform] ?? process.platform;

const resolveFeed = ({ product, flags }: Pick<MainContext, 'product' | 'flags'>, channel?: string): UpdateFeed | null => {
  const { repo, envPrefix } = product;
  if (!repo) return null;
  const override = process.env[`${envPrefix}${API_ORIGIN_SUFFIX}`];
  const apiOrigin = override && override.length > 0 ? override : GITHUB_API;
  const resolvedChannel = channelOf(channel);
  return {
    repoUrl: `${GITHUB_WEB}/${repo.owner}/${repo.name}`,
    releasesApi: `${apiOrigin}/repos/${repo.owner}/${repo.name}/releases`,
    releasePage: `${GITHUB_WEB}/${repo.owner}/${repo.name}/releases`,
    channel: resolvedChannel,
    feedFile: `releases.${resolvedChannel}.json`,
    harness: apiOrigin !== GITHUB_API,
    localSource: flags.flagValue(UPDATE_SOURCE_FLAG),
  };
};

export { resolveFeed };
