/* @layer renderer-shell @kind logic */
import { useFocusModeStore } from './useFocusModeStore';

const forgetFocusMode = (): void => useFocusModeStore.setState({ on: false, saved: null });

export { forgetFocusMode };
