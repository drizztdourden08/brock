/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { usePageOverride } from '../../renderer/bucket/behavior/usePageOverride';
import { OnlineView } from '../../renderer/views/OnlineView';
import { PAGE_METAS } from '../pages.constants';

const meta: ScreenMeta = PAGE_METAS.online;

const RandomizerOnlinePage = () => <>{usePageOverride('online') ?? <OnlineView />}</>;

export default RandomizerOnlinePage;
export { meta };
