/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { OnlineView } from '../../renderer/views/OnlineView';
import { PAGE_METAS } from '../pages.constants';

const meta: ScreenMeta = PAGE_METAS.online;

const RandomizerOnlinePage = () => <OnlineView />;

export default RandomizerOnlinePage;
export { meta };
