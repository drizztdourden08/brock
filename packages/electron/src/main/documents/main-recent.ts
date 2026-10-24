/* @layer electron-main @kind logic */
import type { RecentDocument } from '@drizztdourden08/brock-core/platform';
import { getAppState } from '@drizztdourden08/brock-core/storage';
import type { MainContext } from '../types/main-context.type';
import { trackingOf } from './tracking-of';

const mainRecent = async (ctx: Pick<MainContext, 'paths' | 'documents' | 'log' | 'files' | 'profiles'>, profileId?: string): Promise<RecentDocument[]> => {
  const { recent, profile } = trackingOf(ctx);
  if (profileId !== undefined) return recent.list(await profile(profileId));
  const last = (await getAppState(ctx.files)).lastProfileId;
  return last === null || (await ctx.profiles.load(last)) === null ? [] : recent.list(last);
};

export { mainRecent };
