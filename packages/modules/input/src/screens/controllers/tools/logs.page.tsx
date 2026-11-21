/* @layer renderer-app @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { ScreenMeta } from '@drizztdourden08/brock-react';
import { ControllerLogs } from '../../../views/ControllerLogs';

const meta: ScreenMeta = { title: msg('input:page.logs'), icon: 'scroll-text', order: 1, fill: true, keywords: ['log', 'connect', 'disconnect', 'hid', 'report', 'history'] };

const LogsPage = () => <ControllerLogs />;

export default LogsPage;
export { meta };
