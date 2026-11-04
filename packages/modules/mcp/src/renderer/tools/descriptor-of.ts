/* @layer renderer-shell @kind logic */
import { BUILT_IN_TOOLS } from '../../built-in-tools.constants';
import type { McpToolDescriptor } from '../../mcp.type';

const descriptorOf = (name: string): McpToolDescriptor => {
  const spec = BUILT_IN_TOOLS.find((each) => each.name === name);
  if (spec === undefined) throw new Error(`mcp built-in "${name}" has no spec`);
  return {
    name: spec.name,
    title: spec.title,
    description: spec.description,
    args: spec.args,
    readOnly: spec.readOnly,
    destructive: spec.destructive,
  };
};

export { descriptorOf };
