/* @layer renderer-shell @kind constants */
import type { FinishLook, WizardStep, WizardStepInfo } from './diagnostics-wizard.type';

const ALL_STEPS: readonly WizardStepInfo[] = [
  { step: 'intro', label: 'Intro' },
  { step: 'choose-controller', label: 'Choose a controller' },
  { step: 'byte-capture', label: 'Byte capture' },
  { step: 'positional-capture', label: 'Positional capture' },
  { step: 'summary', label: 'Summary' },
];

const COPY_LABELS = { idle: 'Copy JSON', ok: 'Copied', error: 'Failed' };
const SAVE_LABELS = { idle: 'Write to disk', ok: 'Saved', error: 'Failed' };

const PROBLEMS = {
  releasing: 'Waiting for your controllers to be released.',
  releaseFailed: 'The controllers could not be released.',
  missingPad: 'That controller was not found.',
  pickPad: 'Pick a controller to continue.',
  needCapture: 'Capture at least one input to continue.',
  restoring: 'Waiting for the controllers to come back.',
};

const BUSY_HINTS: Partial<Record<WizardStep, string>> = {
  'choose-controller': 'Reading the layout of the controller...',
  intro: 'Reading the layout of the controller...',
  'positional-capture': 'Bringing the controllers back...',
};

const DEFAULT_FINISH: FinishLook = { label: 'Close', icon: 'check' };

const NO_ERRORS: Readonly<Record<string, string>> = {};

const RESTART_LABEL = 'Restart on another controller';
const RESTART_SAME_LABEL = 'Run again';

const LAYOUT_POLL_MS = 120;
const CLAIM_TIMEOUT_MS = 4000;
const SHUTDOWN_POLL_MS = 150;
const SETTLE_MS = 1500;

export {
  ALL_STEPS, BUSY_HINTS, CLAIM_TIMEOUT_MS, COPY_LABELS, DEFAULT_FINISH, LAYOUT_POLL_MS, NO_ERRORS, PROBLEMS, RESTART_LABEL, RESTART_SAME_LABEL, SAVE_LABELS, SETTLE_MS,
  SHUTDOWN_POLL_MS,
};
