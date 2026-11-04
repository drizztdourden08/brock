/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { OptionsView } from '../renderer/views/OptionsView';
import { PAGE_METAS } from './pages.constants';

const meta: ScreenMeta = PAGE_METAS.options;

const RandomizerOptionsPage = () => <OptionsView />;

export default RandomizerOptionsPage;
export { meta };
