/* @layer electron-main @kind config */
import type { BootstrapOptions, HandlerGroup } from '../types/main-context.type';
import { bootHandlers } from '../boot/ipc-handlers';
import { windowHandlers } from '../window/ipc-handlers';
import { aspectRatioHandlers } from '../window/aspect-ratio';
import { appHandlers } from '../app/ipc-handlers';
import { dialogHandlers } from '../handlers/dialogs';
import { fileHandlers } from '../handlers/file-handlers';
import { storageHandlers } from '../handlers/storage-handlers';
import { profileHandlers } from '../handlers/profile-handlers';
import { sessionHandlers } from '../handlers/session-handlers';
import { uiViewsHandlers } from '../handlers/ui-views-handlers';
import { diagnosticsHandlers } from '../diagnostics/ipc-handlers';
import { networkHandlers } from '../network/ipc-handlers';
import { sessionLogHandlers } from '../handlers/session-log-handler';
import { screenshotHandlers } from '../handlers/screenshot-handler';

const baseHandlers = ({ dataDomains = [] }: BootstrapOptions): HandlerGroup[] => [
  bootHandlers,
  windowHandlers,
  aspectRatioHandlers,
  appHandlers,
  dialogHandlers,
  fileHandlers,
  storageHandlers(dataDomains),
  profileHandlers,
  sessionHandlers,
  uiViewsHandlers,
  diagnosticsHandlers,
  networkHandlers,
  sessionLogHandlers,
  screenshotHandlers,
];

export { baseHandlers };
