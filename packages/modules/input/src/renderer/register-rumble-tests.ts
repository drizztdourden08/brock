/* @layer renderer-shell @kind logic */
import type { RumbleTest } from './rumble-test.type';
import { useRumbleTestStore } from './useRumbleTestStore';

const registerRumbleTests = (tests: readonly RumbleTest[]): (() => void) => useRumbleTestStore.getState().add(tests);

export { registerRumbleTests };
