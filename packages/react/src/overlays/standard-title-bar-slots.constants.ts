/* @layer renderer-shell @kind constants */
import { BugReportButton } from '../bug-report/BugReportButton/BugReportButton';
import type { TitleBarSlot } from '../modules/renderer-module.type';
import { SearchButton } from '../palette/SearchButton/SearchButton';

const STANDARD_TITLE_BAR_SLOTS: readonly TitleBarSlot[] = [SearchButton, BugReportButton];

export { STANDARD_TITLE_BAR_SLOTS };
