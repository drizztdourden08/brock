/* @layer electron-main @kind logic */
import type { RecentDocument } from '@drizztdourden08/brock-core/platform';
import { getAppState } from '@drizztdourden08/brock-core/storage';
import type { MainContext } from '../types/main-context.type';
import { profileIdOf } from './profile-id-of';
import { trackingOf } from './tracking-of';

const mainRecent = async (ctx: Pick<MainContext, 'paths' | 'documents' | 'log' | 'files'>, profileId?: string): Promise<RecentDocument[]> => {
  const id = profileId ?? (await getAppState(ctx.files)).lastProfileId;
  return id === null ? [] : trackingOf(ctx).recent.list(profileIdOf(id));
};

export { mainRecent };
