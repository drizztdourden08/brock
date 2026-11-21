/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { DisplayRowCopy, DisplayRowId, DisplaySectionCopy, DisplaySectionId, WindowModeCopy } from './DisplaySettingsTab.type';

const WINDOW_MODE_COPY: readonly WindowModeCopy[] = [
  { value: 'windowed', label: msg('display:mode.windowed.label'), hint: msg('display:mode.windowed.hint') },
  { value: 'borderless', label: msg('display:mode.borderless.label'), hint: msg('display:mode.borderless.hint') },
  { value: 'fullscreen', label: msg('display:mode.fullscreen.label'), hint: msg('display:mode.fullscreen.hint') },
];

const FOLLOW_WINDOW_LABEL = msg('display:monitor.followWindow');

const DISPLAY_SECTION_COPY: Record<DisplaySectionId, DisplaySectionCopy> = {
  window: { title: msg('display:section.window.title'), description: msg('display:section.window.description') },
  refreshRate: { title: msg('display:section.refreshRate.title'), description: msg('display:section.refreshRate.description') },
};

const DISPLAY_ROW_COPY: Record<DisplayRowId, DisplayRowCopy> = {
  windowMode: {
    label: msg('display:row.windowMode.label'),
    description: msg('display:row.windowMode.description'),
    hint: msg('display:row.windowMode.hint'),
    keywords: msg('display:row.windowMode.keywords'),
  },
  displayMonitor: {
    label: msg('display:row.displayMonitor.label'),
    description: msg('display:row.displayMonitor.description'),
    hint: msg('display:row.displayMonitor.hint'),
    keywords: msg('display:row.displayMonitor.keywords'),
  },
  detectedRate: {
    label: msg('display:row.detectedRate.label'),
    description: msg('display:row.detectedRate.description'),
    hint: msg('display:row.detectedRate.hint'),
    keywords: msg('display:row.detectedRate.keywords'),
  },
  syncedRateInFullscreen: {
    label: msg('display:row.syncedRateInFullscreen.label'),
    description: msg('display:row.syncedRateInFullscreen.description'),
    hint: msg('display:row.syncedRateInFullscreen.hint'),
    keywords: msg('display:row.syncedRateInFullscreen.keywords'),
  },
  syncedRateTargetHz: {
    label: msg('display:row.syncedRateTargetHz.label'),
    description: msg('display:row.syncedRateTargetHz.description'),
    hint: msg('display:row.syncedRateTargetHz.hint'),
    keywords: msg('display:row.syncedRateTargetHz.keywords'),
  },
  changeRate: {
    label: msg('display:row.changeRate.label'),
    description: msg('display:row.changeRate.description'),
    hint: msg('display:row.changeRate.hint'),
    keywords: msg('display:row.changeRate.keywords'),
  },
};

export { WINDOW_MODE_COPY, FOLLOW_WINDOW_LABEL, DISPLAY_SECTION_COPY, DISPLAY_ROW_COPY };
