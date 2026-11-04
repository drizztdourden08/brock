/* @layer renderer-app @kind component */
import { LogsView } from '../views/LogsView';
import { PAGE_METAS } from './pages.meta';

const meta = PAGE_METAS.logs;

const RandomizerLogsPage = () => <LogsView />;

export default RandomizerLogsPage;
export { meta };
