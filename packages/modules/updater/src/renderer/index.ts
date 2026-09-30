/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';
import { UpdaterProvider } from './UpdaterProvider';
import { UPDATER_MENU } from './updater-menu.constants';
import { UpdateBadge } from './UpdateBadge';

const updaterRenderer: RendererModule = {
  id: 'updater',
  Provider: UpdaterProvider,
  menu: UPDATER_MENU,
  titleBar: [UpdateBadge],
};

export default updaterRenderer;
export { updaterRenderer, UPDATER_MENU };
export { updaterApi } from './updater-api';
export { useUpdaterStore } from './useUpdaterStore';
export type { UpdateStatus, UpdaterData, UpdaterActions, UpdaterStoreState } from './updater-store.type';
export { UpdateDialog } from './UpdateDialog';
export { UpdateBadge } from './UpdateBadge';
export { UpdaterProvider } from './UpdaterProvider';
export type { UpdaterProviderProps } from './UpdaterProvider';
export type { UpdaterApi, UpdateInfo, VersionOption, UpdaterCapabilities, UpdaterPrefs } from '../updater.type';
