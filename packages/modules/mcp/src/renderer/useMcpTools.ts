/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import type { McpToolDef } from '../mcp.type';
import { registerAll } from './register-all';

const useMcpTools = (defs: readonly McpToolDef[]): void => {
  const latest = useRef(defs);
  const shape = defs.map((def) => def.name).join('|');
  useEffect(() => {
    latest.current = defs;
  });
  useEffect(() => {
    const live = latest.current.map((def): McpToolDef => ({
      ...def,
      run: (args, call) => (latest.current.find((each) => each.name === def.name) ?? def).run(args, call),
    }));
    return registerAll(live);
  }, [shape]);
};

export { useMcpTools };
