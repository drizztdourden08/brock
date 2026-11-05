/* @layer renderer-app @kind component */
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { usePageOverride } from '../renderer/bucket/behavior/usePageOverride';
import { LogsView } from '../renderer/views/LogsView';
import { PAGE_METAS } from './pages.constants';

const meta: ScreenMeta = PAGE_METAS.logs;

const RandomizerLogsPage = () => <>{usePageOverride('logs') ?? <LogsView />}</>;

export default RandomizerLogsPage;
export { meta };
