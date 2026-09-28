/* @layer renderer-shell @kind logic */
import type { InputStatus } from '../../../device.type';

const statusLine = (loaded: boolean, status: InputStatus, count: number): string => {
  if (!loaded) return 'Looking for controllers';
  if (!status.available) return 'SDL3 addon not loaded';
  const devices = count === 1 ? '1 device' : `${count} devices`;
  return `SDL ${status.sdlVersion ?? 'unknown'}, ${devices}`;
};

export { statusLine };
