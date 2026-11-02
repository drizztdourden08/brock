/* @layer renderer-shell @kind logic */
import { NO_FOCUS_KEEP } from './widget.constants';
import { useFocusModeStore } from './useFocusModeStore';
import type { FocusKeep } from './widget.type';

const focusKeep = (keep: Partial<FocusKeep>): void => {
  useFocusModeStore.setState({ keep: { ...NO_FOCUS_KEEP, ...keep } });
};

export { focusKeep };
