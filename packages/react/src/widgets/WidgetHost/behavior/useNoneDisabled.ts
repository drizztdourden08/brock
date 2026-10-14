/* @layer renderer-shell @kind hook */
import type { WidgetDisabledOf } from '../WidgetHost.type';
import { NONE_DISABLED } from './useDisabledWidgets.constants';

const useNoneDisabled = (): WidgetDisabledOf => NONE_DISABLED;

export { useNoneDisabled };
