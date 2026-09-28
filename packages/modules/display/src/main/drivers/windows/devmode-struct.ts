/* @layer electron-main @kind logic */
import type { Koffi } from '../koffi/koffi.type';
import { DEVMODEW_SCALARS, DEVMODEW_TAIL } from './windows.constants';

const devModeStruct = (koffi: Koffi): unknown => koffi.struct('DEVMODEW', {
  dmDeviceName: koffi.array('char16', 32),
  ...Object.fromEntries(DEVMODEW_SCALARS),
  dmFormName: koffi.array('char16', 32),
  ...Object.fromEntries(DEVMODEW_TAIL),
});

export { devModeStruct };
