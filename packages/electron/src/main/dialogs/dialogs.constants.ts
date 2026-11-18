/* @layer electron-main @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';

const DEFAULT_CONFIRM_KEY = msg('brock-main:dialog.ok');
const DEFAULT_CANCEL_KEY = msg('brock-main:dialog.cancel');
const CONFIRM_BUTTON = 0;
const CANCEL_BUTTON = 1;
const MIN_CHOICES = 2;
const MAX_CHOICES = 4;
const NON_BLOCKING_FLAGS = ['--review', '--screenshot', '--screenshot-splash'];

export { CANCEL_BUTTON, CONFIRM_BUTTON, DEFAULT_CANCEL_KEY, DEFAULT_CONFIRM_KEY, MAX_CHOICES, MIN_CHOICES, NON_BLOCKING_FLAGS };
