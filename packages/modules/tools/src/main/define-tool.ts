/* @layer electron-main @kind logic */
import type { ToolDef, ToolDownload } from '../tools.type';
import { BINARY_NAME, DEFAULT_VERSION, SHA256_HEX, TOOL_ID } from './tools-main.constants';

const assertDownload = (id: string, platform: string, download: ToolDownload): void => {
  if (!SHA256_HEX.test(download.sha256)) throw new Error(`tool "${id}" download for ${platform} needs a sha256 of 64 hex digits`);
  if (!/^https?:\/\//.test(download.url)) throw new Error(`tool "${id}" download for ${platform} must be an http or https URL`);
};

const defineTool = (def: ToolDef): ToolDef => {
  if (!TOOL_ID.test(def.id)) throw new Error(`tool id "${def.id}" must be a slug like "ffmpeg"`);
  if (def.binaries.length === 0) throw new Error(`tool "${def.id}" names no binary`);
  const bad = def.binaries.find((name) => !BINARY_NAME.test(name));
  if (bad !== undefined) throw new Error(`tool "${def.id}" binary "${bad}" must be a bare file name with no folder and no .exe`);
  if (def.version !== undefined && !TOOL_ID.test(def.version.replace(/\./g, '-'))) throw new Error(`tool "${def.id}" version "${def.version}" must be a plain version like "7.1"`);
  for (const [platform, download] of Object.entries(def.downloads ?? {})) assertDownload(def.id, platform, download);
  return { usePath: true, version: DEFAULT_VERSION, ...def };
};

export { defineTool };
