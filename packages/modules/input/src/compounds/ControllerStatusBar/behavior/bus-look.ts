/* @layer renderer-shell @kind logic */
import type { ControllerBusType } from '../../../device.type';
import { BUS_ICON, BUS_LABEL } from '../ControllerStatusBar.constants';
import type { ConnectionLook } from './connection-look.type';
import { lookOf } from './look-of';

const busLookOf = (busType?: ControllerBusType): ConnectionLook | null =>
  (busType ? lookOf(BUS_ICON[busType], BUS_LABEL[busType]) : null);

export { busLookOf };
