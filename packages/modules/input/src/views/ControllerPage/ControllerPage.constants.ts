/* @layer renderer-components @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { RumbleTest } from '../../renderer/rumble-test.type';

const PULSE_100 = { durationMs: 100, intensity: 1.0 };
const PULSE_1000 = { durationMs: 1000, intensity: 1.0 };

const RUMBLE_TESTS: readonly RumbleTest[] = [
  { label: '100ms', steps: [PULSE_100], gapMs: 0 },
  { label: '250ms', steps: [{ durationMs: 250, intensity: 1.0 }], gapMs: 0 },
  { label: '1000ms', steps: [PULSE_1000], gapMs: 0 },
  { label: '3×100ms', steps: [PULSE_100, PULSE_100, PULSE_100], gapMs: 50 },
  { label: '2-long-2', steps: [PULSE_100, PULSE_100, PULSE_1000, PULSE_100, PULSE_100], gapMs: 50 },
];

const IDLE_BUTTON_SLOTS = 32;
const IDLE_AXIS_SLOTS = 6;

const FALLBACK_GLYPH = 'generic-btn';

const NO_RUMBLE_REASON = msg('input:rumble.none');
const UNMAPPED_REASON = msg('input:controller.unmapped');

const NO_PADS_KEY = 'none';
const NO_PADS_TITLE = msg('input:pads.none');
const NO_PADS_MESSAGE = msg('input:pads.noneMessage');
const GONE_MESSAGE = msg('input:pads.gone');
const CONNECTED_LABEL = msg('input:controller.connected');
const UNAVAILABLE_LABEL = msg('input:controller.unavailable');
const INFO_TITLE = msg('input:controller.title');
const FACTS_LABEL = msg('input:controller.facts');
const BUTTONS_TITLE = msg('input:controller.buttons.title');
const OTHER_INPUTS_NOTE = msg('input:controller.buttons.other');
const NO_OTHER_INPUTS_NOTE = msg('input:controller.buttons.otherNone');
const AXES_TITLE = msg('input:controller.axes.title');
const NO_AXES_NOTE = msg('input:controller.axes.none');

const ICON_SIZE = 14;
const RUN_DIAGNOSTICS_LABEL = msg('input:card.runDiagnostics');
const DIAGNOSE_AND_REPORT_LABEL = msg('input:card.diagnoseAndReport');
const DIAGNOSTICS_ROUTE = 'controllers/diagnostics';

export {
  AXES_TITLE, BUTTONS_TITLE, CONNECTED_LABEL, FACTS_LABEL, INFO_TITLE, NO_AXES_NOTE, NO_OTHER_INPUTS_NOTE, OTHER_INPUTS_NOTE, UNAVAILABLE_LABEL,
  DIAGNOSE_AND_REPORT_LABEL, DIAGNOSTICS_ROUTE, FALLBACK_GLYPH, GONE_MESSAGE, ICON_SIZE, IDLE_AXIS_SLOTS, IDLE_BUTTON_SLOTS, NO_PADS_KEY, NO_PADS_MESSAGE, NO_PADS_TITLE, NO_RUMBLE_REASON,
  RUMBLE_TESTS, RUN_DIAGNOSTICS_LABEL, UNMAPPED_REASON,
};
