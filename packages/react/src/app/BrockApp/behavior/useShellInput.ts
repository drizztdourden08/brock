/* @layer renderer-shell @kind hook */
import { useRegionMemory } from '../../../regions/useRegionMemory';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { useMouseBack } from './useMouseBack';

const useShellInput = (): void => {
  useKeyboardShortcuts();
  useRegionMemory();
  useMouseBack();
};

export { useShellInput };
