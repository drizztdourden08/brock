/* @layer electron-main @kind logic */
import type { MainTool } from '../mcp-main.type';
import { appInfoTool } from './app-info-tool';
import { clickTool } from './click-tool';
import { pressKeyTool } from './press-key-tool';
import { screenshotTool } from './screenshot-tool';
import { scrollTool } from './scroll-tool';
import { typeTextTool } from './type-text-tool';

const mainTools: Readonly<Partial<Record<string, MainTool>>> = {
  app_info: appInfoTool,
  screenshot: screenshotTool,
  click: clickTool,
  type_text: typeTextTool,
  press_key: pressKeyTool,
  scroll: scrollTool,
};

export { mainTools };
