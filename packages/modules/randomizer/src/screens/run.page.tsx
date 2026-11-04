/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { RunView } from '../renderer/views/RunView';
import { PAGE_METAS } from './pages.constants';

const meta: ScreenMeta = PAGE_METAS.run;

const RandomizerRunPage = () => <RunView />;

export default RandomizerRunPage;
export { meta };
