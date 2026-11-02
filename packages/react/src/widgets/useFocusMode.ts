/* @layer renderer-shell @kind hook */
import { useFocusModeStore } from './useFocusModeStore';

const useFocusMode = (): boolean => useFocusModeStore((state) => state.on);

export { useFocusMode };
