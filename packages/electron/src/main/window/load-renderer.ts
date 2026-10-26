/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { basename } from 'path';
import { devServerUrl } from './dev-server-url';

const loadRendererPage = (win: BrowserWindow, filePath: string, query: Record<string, string> = {}): void => {
  const server = devServerUrl();
  if (server) {
    const url = new URL(`/${basename(filePath)}`, server);
    for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
    void win.loadURL(url.toString());
    return;
  }
  void win.loadFile(filePath, { query });
};

export { loadRendererPage };
