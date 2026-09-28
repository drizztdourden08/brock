/* @layer electron-main @kind logic */
import { app, nativeImage } from 'electron';
import type { InstanceIdentity } from './instance-identity.type';

const applyInstanceIdentity = (instanceName: string | null, { appId, iconPath }: InstanceIdentity): void => {
  if (!instanceName) return;

  if (process.platform === 'win32') {
    app.setAppUserModelId(`${appId}.instance.${instanceName}`);
    return;
  }

  if (process.platform === 'darwin' && iconPath) {
    const image = nativeImage.createFromPath(iconPath);
    if (!image.isEmpty()) app.dock?.setIcon(image);
  }
};

export { applyInstanceIdentity };
