/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { bugReport } from '../bug-report/bug-report';
import { REPORT_BUG_ENTRY } from '../app/BrockApp/BrockApp.constants';
import { palette } from '../palette/palette';
import type { TitleBarActionDef } from '../title-bar/title-bar-action.type';

const SEARCH_ACTION: TitleBarActionDef = { id: 'search', label: msg('brock-shell:titleBar.search'), icon: 'search', tone: 'primary', effect: 'twinkle', onSelect: palette.toggle };

const REPORT_BUG_ACTION: TitleBarActionDef = { id: REPORT_BUG_ENTRY.key, label: REPORT_BUG_ENTRY.label, icon: 'bug', tone: 'danger', effect: 'ping', onSelect: () => bugReport.open() };

const STANDARD_TITLE_BAR_ACTIONS: readonly TitleBarActionDef[] = [SEARCH_ACTION, REPORT_BUG_ACTION];

export { STANDARD_TITLE_BAR_ACTIONS };
