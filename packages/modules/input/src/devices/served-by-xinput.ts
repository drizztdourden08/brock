/* @layer core @kind logic */
import { GUID_DRIVER_SIGNATURE_OFFSET, XINPUT_DRIVER_SIGNATURES } from './device-snapshot.constants';

const servedByXInput = (guid: string): boolean =>
  XINPUT_DRIVER_SIGNATURES.has(guid.slice(GUID_DRIVER_SIGNATURE_OFFSET, GUID_DRIVER_SIGNATURE_OFFSET + 2).toLowerCase());

export { servedByXInput };
