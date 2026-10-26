/* @layer electron-main @kind logic */
import { devServerUrl } from '../window/dev-server-url';
import { getMainWindow } from '../window/get-main-window';
import type { Frame, FrameEvent } from './from-app-frame.type';

const originOf = (url: string): string | null => {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
};

const fromAppOrigin = (frame: Frame): boolean => {
  const server = devServerUrl();
  if (server) return frame.origin === originOf(server);
  return frame.url.startsWith('file://') && (frame.origin === 'file://' || frame.origin === 'null');
};

const fromAppFrame = (event: FrameEvent, { anyWindow = false }: { anyWindow?: boolean } = {}): boolean => {
  const { sender, senderFrame } = event;
  if (!senderFrame || senderFrame !== sender.mainFrame) return false;
  if (!fromAppOrigin(senderFrame)) return false;
  return anyWindow || getMainWindow()?.webContents === sender;
};

export { fromAppFrame };
