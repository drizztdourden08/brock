/* @layer renderer-shell @kind barrel */
import '../augment';
import type { RendererModule } from '@drizztdourden08/brock-react';
import { UpdaterProvider } from './UpdaterProvider';
import { UPDATER_MENU } from './updater-menu.constants';
import { useUpdateAction } from './useUpdateAction';
import { selfUpdateHost } from './self-update-host';

const updaterRenderer: RendererModule = {
  id: 'updater',
  Provider: UpdaterProvider,
  get menu() {
    return selfUpdateHost() ? UPDATER_MENU : [];
  },
  titleBarActions: [useUpdateAction],
};

export default updaterRenderer;
export { updaterRenderer, UPDATER_MENU };
export { updaterApi } from './updater-api';
export { useUpdaterStore } from './useUpdaterStore';
export type { UpdateStatus, UpdaterData, UpdaterActions, UpdaterStoreState } from './updater-store.type';
export { UpdateDialog } from './UpdateDialog';
export { useUpdateAction } from './useUpdateAction';
export { useSelfUpdateHost } from './useSelfUpdateHost';
export { selfUpdateHost } from './self-update-host';
export { setUpdateNotice } from './set-update-notice';
export { resolveUpdateNotice } from './resolve-update-notice';
export type { UpdateNotice, UpdateNoticeAction, UpdateNoticeContext, UpdateNoticeRender } from './update-notice.type';
export { UpdaterProvider } from './UpdaterProvider';
export type { UpdaterProviderProps } from './UpdaterProvider';
export type { ReleaseAsset, ReleaseMeta, UpdaterApi, UpdateInfo, VersionOption, UpdaterCapabilities, UpdaterPrefs } from '../updater.type';
