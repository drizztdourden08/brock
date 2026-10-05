/* @layer renderer-shell @kind constants */
import { TESSERA_STRINGS } from '@drizztdourden08/tessera/primitives';
import type { ConfirmActionOptions } from '../stores/dialog.type';
import type { NavigationSnapshot, ScreenParams } from './navigation.type';

const NO_PARAMS: ScreenParams = {};
const ROUTE_SEPARATOR = '/';
const EMPTY_NAVIGATION: NavigationSnapshot = { active: null, params: NO_PARAMS, history: {}, remembered: {}, parent: null, escapeTo: null };
const HISTORY_LIMIT = 50;
const PARAM_PREFIX = ':';

const DISCARD_CHANGES: ConfirmActionOptions = {
  title: TESSERA_STRINGS.common.unsavedTitle,
  message: 'This page has changes that are not saved. Leave it and lose them?',
  confirmLabel: TESSERA_STRINGS.common.discard,
  cancelLabel: TESSERA_STRINGS.common.keepEditing,
  variant: 'danger',
};

const UNSAVED_QUIT_MESSAGE = 'A page has changes that are not saved.';

export { DISCARD_CHANGES, EMPTY_NAVIGATION, HISTORY_LIMIT, NO_PARAMS, PARAM_PREFIX, ROUTE_SEPARATOR, UNSAVED_QUIT_MESSAGE };
