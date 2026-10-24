/* @layer electron-main @kind logic */
import { writeFile as writeToDisk } from 'fs/promises';
import { extname } from 'path';
import { MARKED_EXTENSIONS, ZONE_CONTENT, ZONE_STREAM } from './mark-of-the-web.constants';
import type { MarkDeps } from './mark-of-the-web.type';

const markOfTheWeb = async (path: string, { platform = process.platform, writeFile = writeToDisk }: MarkDeps = {}): Promise<void> => {
  if (platform !== 'win32' || !MARKED_EXTENSIONS.has(extname(path).toLowerCase())) return;
  await writeFile(`${path}${ZONE_STREAM}`, ZONE_CONTENT).catch(() => undefined);
};

export { markOfTheWeb };
