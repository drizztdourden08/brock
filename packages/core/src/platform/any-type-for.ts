/* @layer core @kind logic */
import type { PlatformInfo } from './platform.type';
import type { AnyTypeOption } from './ports/file-picker.type';

const anyTypeFor = (anyType: AnyTypeOption | undefined, { host, formFactor }: Pick<PlatformInfo, 'host' | 'formFactor'>): boolean => {
  if (typeof anyType === 'boolean' || anyType === undefined) return anyType === true;
  if (typeof anyType === 'string') return anyType === host || anyType === formFactor;
  return anyType[host] ?? anyType[formFactor] ?? false;
};

export { anyTypeFor };
