/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { SpoilerView } from '../renderer/views/SpoilerView';
import { PAGE_METAS } from './pages.constants';

const meta: ScreenMeta = PAGE_METAS.spoiler;

const RandomizerSpoilerPage = () => <SpoilerView />;

export default RandomizerSpoilerPage;
export { meta };
