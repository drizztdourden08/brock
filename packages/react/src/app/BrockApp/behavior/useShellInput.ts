/* @layer renderer-shell @kind hook */
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useMouseBack } from './useMouseBack';

const useShellInput = (): void => {
  useKeyboardShortcuts();
  useMouseBack();
};

export { useShellInput };
