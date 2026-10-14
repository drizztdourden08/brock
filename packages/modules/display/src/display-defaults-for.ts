/* @layer core @kind logic */
import type { HostShell } from '@drizztdourden08/brock-core';
import { DEFAULT_DISPLAY_SETTINGS, HOST_DISPLAY_DEFAULTS } from './display.constants';
import type { DisplaySettings } from './display.type';

const displayDefaultsFor = (host: HostShell): DisplaySettings => ({ ...DEFAULT_DISPLAY_SETTINGS, ...HOST_DISPLAY_DEFAULTS[host] });

export { displayDefaultsFor };
