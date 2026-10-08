/* @layer renderer-shell @kind hook */
import { useCallback, useEffect, useState } from 'react';
import { jobs } from '@drizztdourden08/brock-react';
import type { ToolState } from '../tools.type';
import type { UseToolResult } from './use-tool.type';
import { toolsApi } from './tools-api';

const useTool = (id: string): UseToolResult => {
  const [state, setState] = useState<ToolState | null>(null);
  const [installing, setInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setState(await toolsApi()?.state(id) ?? null);
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const install = useCallback(async () => {
    const api = toolsApi();
    if (!api) return false;
    setInstalling(true);
    setError(null);
    jobs.open(`tool:${id}`);
    const result = await api.install(id);
    setInstalling(false);
    if (result.success) setState(result.value);
    else setError(result.error);
    return result.success;
  }, [id]);

  return { state, installing, error, install, refresh };
};

export { useTool };
