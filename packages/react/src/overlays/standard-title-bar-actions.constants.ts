/* @layer renderer-shell @kind constants */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { bugReport } from '../bug-report/bug-report';
import { REPORT_BUG_ENTRY } from '../app/BrockApp/BrockApp.constants';
import { palette } from '../palette/palette';

const SEARCH_ACTION: WindowTitleBarAction = { id: 'search', label: 'Search', icon: 'search', shortcut: ['ctrl', 'K'], tone: 'primary', effect: 'twinkle', onSelect: palette.toggle };

const REPORT_BUG_ACTION: WindowTitleBarAction = { id: REPORT_BUG_ENTRY.key, label: REPORT_BUG_ENTRY.label, icon: 'bug', tone: 'danger', effect: 'ping', onSelect: bugReport.open };

const STANDARD_TITLE_BAR_ACTIONS: readonly WindowTitleBarAction[] = [SEARCH_ACTION, REPORT_BUG_ACTION];

export { STANDARD_TITLE_BAR_ACTIONS };
