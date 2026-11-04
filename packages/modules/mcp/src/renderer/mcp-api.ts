/* @layer renderer-shell @kind logic */
import type { IpcNamespaces } from '@drizztdourden08/brock-core';
import { hostApi } from '@drizztdourden08/brock-react';

const mcpApi = (): IpcNamespaces['mcp'] | null => hostApi()?.mcp ?? null;

export { mcpApi };
