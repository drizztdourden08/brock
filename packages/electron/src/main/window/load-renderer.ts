/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { basename } from 'path';
import { is } from '@electron-toolkit/utils';

const devServerUrl = (): string | null => (is.dev ? (process.env['ELECTRON_RENDERER_URL'] ?? null) : null);

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
