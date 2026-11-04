/* @layer renderer-app @kind component */
import { SpoilerView } from '../views/SpoilerView';
import { PAGE_METAS } from './pages.constants';

const meta = PAGE_METAS.spoiler;

const RandomizerSpoilerPage = () => <SpoilerView />;

export default RandomizerSpoilerPage;
export { meta };
