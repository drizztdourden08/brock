/* @layer electron-main @kind logic */
import { execFile } from 'child_process';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';
import type { OsIntegrationProduct } from './os-integration.type';
import { DESKTOP_DIR, MIME_DIR } from './os-integration.constants';
import { linuxDesktopEntry } from './linux-desktop-entry';
import { linuxMimeXml } from './linux-mime-xml';

const writeIfChanged = async (file: string, content: string): Promise<boolean> => {
  const current = await readFile(file, 'utf8').catch(() => null);
  if (current === content) return false;
  await writeFile(file, content);
  return true;
};

const refresh = (tool: string, dir: string): void => {
  execFile(tool, [dir], { windowsHide: true }, () => undefined);
};

const installLinuxIntegration = async (product: OsIntegrationProduct, exec: string, home: string = homedir()): Promise<void> => {
  if (product.protocols.length === 0 && product.fileAssociations.length === 0) return;
  const desktopDir = join(home, ...DESKTOP_DIR);
  await mkdir(desktopDir, { recursive: true });
  if (await writeIfChanged(join(desktopDir, `${product.id}.desktop`), linuxDesktopEntry(product, exec))) refresh('update-desktop-database', desktopDir);
  const xml = linuxMimeXml(product);
  if (xml === null) return;
  const mimeDir = join(home, ...MIME_DIR);
  await mkdir(join(mimeDir, 'packages'), { recursive: true });
  if (await writeIfChanged(join(mimeDir, 'packages', `${product.id}.xml`), xml)) refresh('update-mime-database', mimeDir);
};

export { installLinuxIntegration };
