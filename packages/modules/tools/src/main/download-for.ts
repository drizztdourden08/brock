/* @layer electron-main @kind logic */
import type { ToolDef, ToolDownload, ToolPlatform } from '../tools.type';
import { defineTool } from './define-tool';

const downloadFor = async (def: ToolDef, platform: ToolPlatform | null): Promise<ToolDownload | null> => {
  if (platform === null) return null;
  const fixed = def.downloads?.[platform];
  if (fixed) return fixed;
  const resolved = await def.resolveDownload?.(platform) ?? null;
  if (resolved) defineTool({ ...def, downloads: { [platform]: resolved } });
  return resolved;
};

export { downloadFor };
