/* @layer mcp-helper @kind logic */
import { isJsonValue } from '@drizztdourden08/brock-core/ipc';
import type { McpJsonArgs } from './helper.type';

const jsonArgsOf = (raw: unknown): McpJsonArgs => {
  if (!isJsonValue(raw) || raw === null || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return raw;
};

export { jsonArgsOf };
