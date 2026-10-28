/* @layer electron-main @kind logic */
import { app, nativeImage } from 'electron';
import type { NativeImage } from 'electron';
import { BLANK_ICON } from './drag-out.constants';

const fileDragIcon = async (path: string): Promise<NativeImage> => {
  const icon = await app.getFileIcon(path, { size: 'normal' }).catch(() => null);
  return icon !== null && !icon.isEmpty() ? icon : nativeImage.createFromDataURL(BLANK_ICON);
};

export { fileDragIcon };
