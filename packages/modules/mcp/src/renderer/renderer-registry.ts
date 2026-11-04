/* @layer renderer-shell @kind logic */
import { BUILT_IN_TOOLS } from '../built-in-tools.constants';
import { createToolRegistry } from '../create-tool-registry';
import type { McpToolRegistry } from '../mcp.type';
import { toolInfoOf } from '../tool-info-of';
import { RENDERER_TOOLS } from './tools/renderer-tools.constants';

const appTools = createToolRegistry(BUILT_IN_TOOLS.map((spec) => spec.name));

const rendererRegistry: McpToolRegistry = {
  register: appTools.register,
  onChange: appTools.onChange,
  get: (name) => RENDERER_TOOLS.find((tool) => tool.name === name) ?? appTools.get(name),
  list: () => [...RENDERER_TOOLS.map(toolInfoOf), ...appTools.list()],
};

export { rendererRegistry };
