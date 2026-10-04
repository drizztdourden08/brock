/* @layer renderer-shell @kind constants */
import type { WidgetWindowState } from '@drizztdourden08/brock-core';
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';

const INITIAL_WINDOW_STATE: WidgetWindowState = { pin: 'off', onTop: false, snap: true, link: null, sync: true, square: false };

const OPTIONS_BUTTON_SELECTOR = `.widget__titlebar-actions .widget__btn[aria-label="${TESSERA_STRINGS.common.options}"]`;

export { INITIAL_WINDOW_STATE, OPTIONS_BUTTON_SELECTOR };
