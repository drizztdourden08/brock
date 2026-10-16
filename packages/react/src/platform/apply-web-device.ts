/* @layer renderer-shell @kind logic */
import type { Platform } from '@drizztdourden08/brock-core';
import { getPlatform } from './get-platform';
import { platformState } from './platform-state';
import type { WebDevice } from './platform.type';

const applyWebDevice = (device: WebDevice): Platform => {
  const current = getPlatform();
  if (current.info.formFactor === device.formFactor && current.info.input === device.input) return current;
  const next: Platform = { ...current, info: { ...current.info, ...device } };
  platformState.platform = next;
  return next;
};

export { applyWebDevice };
