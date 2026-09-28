/* @layer electron-main @kind logic */
import { splashRef } from './splash-ref';

const setSplashStatus = (message: string): void => {
  const splash = splashRef.current;
  if (!splash || splash.isDestroyed()) return;
  const call = `window.__splashStatus?.(${JSON.stringify(message)})`;
  void splash.webContents.executeJavaScript(call).catch(() => undefined);
};

export { setSplashStatus };
