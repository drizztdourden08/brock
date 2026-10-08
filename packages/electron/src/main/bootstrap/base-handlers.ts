/* @layer electron-main @kind config */
import type { HandlerGroup } from '../types/main-context.type';
import { bootHandlers } from '../boot/ipc-handlers';
import { windowHandlers } from '../window/ipc-handlers';
import { aspectRatioHandlers } from '../window/aspect-ratio';
import { appHandlers } from '../app/ipc-handlers';
import { dialogHandlers } from '../handlers/dialog-handlers';
import { fileHandlers } from '../handlers/file-handlers';
import { shellHandlers } from '../handlers/shell-handlers';
import { storageHandlers } from '../handlers/storage-handlers';
import { profileHandlers } from '../handlers/profile-handlers';
import { sessionHandlers } from '../handlers/session-handlers';
import { uiViewsHandlers } from '../handlers/ui-views-handlers';
import { diagnosticsHandlers } from '../diagnostics/ipc-handlers';
import { networkHandlers } from '../network/ipc-handlers';
import { sessionLogHandlers } from '../handlers/session-log-handlers';
import { screenshotHandlers } from '../handlers/screenshot-handlers';
import { dataDomainHandlers } from '../storage/ipc-handlers';
import { transferHandlers } from '../storage/transfer-handlers';
import { jobHandlers } from '../jobs/ipc-handlers';
import { openHandlers } from '../open/ipc-handlers';

const baseHandlers = (): HandlerGroup[] => [
  bootHandlers,
  windowHandlers,
  aspectRatioHandlers,
  appHandlers,
  openHandlers,
  dialogHandlers,
  fileHandlers,
  shellHandlers,
  storageHandlers,
  dataDomainHandlers,
  transferHandlers,
  jobHandlers,
  profileHandlers,
  sessionHandlers,
  uiViewsHandlers,
  diagnosticsHandlers,
  networkHandlers,
  sessionLogHandlers,
  screenshotHandlers,
];

export { baseHandlers };
