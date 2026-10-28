/* @layer electron-main @kind logic */
import { app, nativeImage } from 'electron';
import type { NativeImage } from 'electron';
import { BLANK_ICON } from './drag-out.constants';

const fileDragIcon = async (path: string): Promise<NativeImage> => {
  try {
    const icon = await app.getFileIcon(path, { size: 'normal' });
    if (!icon.isEmpty()) return icon;
  } catch {
    // The blank icon below still lets the drag start.
  }
  return nativeImage.createFromDataURL(BLANK_ICON);
};

export { fileDragIcon };
