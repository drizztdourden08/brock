/* @layer renderer-shell @kind logic */
import type { InputIconFamily } from '@drizztdourden08/tessera/primitives';
import { DEFAULT_INPUT_FAMILY, VENDOR_FAMILIES } from '../CalibrationPanel.constants';

const inputFamilyOf = (vendorId: number | undefined): InputIconFamily =>
  (vendorId === undefined ? undefined : VENDOR_FAMILIES[vendorId]) ?? DEFAULT_INPUT_FAMILY;

export { inputFamilyOf };
