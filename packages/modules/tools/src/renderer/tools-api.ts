/* @layer renderer-shell @kind logic */
import { hostApi } from '@drizztdourden08/brock-react';
import type { ToolsApi } from '../tools.type';

const toolsApi = (): ToolsApi | null => hostApi()?.tools ?? null;

export { toolsApi };
