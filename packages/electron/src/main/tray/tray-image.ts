/* @layer electron-main @kind logic */
import { app, nativeImage } from 'electron';
import type { NativeImage } from 'electron';
import { isAbsolute, join } from 'path';
import { TRAY_ICON_SIZE } from './tray.constants';

const trayImage = (icon: string | undefined): NativeImage => {
  if (!icon) return nativeImage.createEmpty();
  const image = nativeImage.createFromPath(isAbsolute(icon) ? icon : join(app.getAppPath(), icon));
  if (image.isEmpty() || process.platform === 'win32') return image;
  return image.resize({ width: TRAY_ICON_SIZE, height: TRAY_ICON_SIZE });
};

export { trayImage };
