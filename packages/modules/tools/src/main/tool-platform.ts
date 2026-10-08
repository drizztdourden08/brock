/* @layer electron-main @kind logic */
import type { ToolPlatform } from '../tools.type';
import { TOOL_ARCHES, TOOL_OSES } from './tools-main.constants';

const toolPlatform = (platform: string = process.platform, arch: string = process.arch): ToolPlatform | null =>
  (TOOL_OSES.includes(platform) && TOOL_ARCHES.includes(arch) ? `${platform}-${arch}` as ToolPlatform : null);

export { toolPlatform };
