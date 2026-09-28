/* @layer electron-main @kind logic */
import { app, nativeImage } from 'electron';
import type { AppIdentity } from './app-identity.type';
import { appUserModelId } from './app-user-model-id';

const applyAppIdentity = (instanceName: string | null, { appId, iconPath }: AppIdentity): void => {
  if (process.platform === 'win32') {
    app.setAppUserModelId(appUserModelId(appId, instanceName));
    return;
  }

  if (instanceName && process.platform === 'darwin' && iconPath) {
    const image = nativeImage.createFromPath(iconPath);
    if (!image.isEmpty()) app.dock?.setIcon(image);
  }
};

export { applyAppIdentity };
