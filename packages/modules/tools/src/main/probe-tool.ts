/* @layer electron-main @kind logic */
import type { ToolProbe, ToolProbeResult, ToolSpec } from './tools-main.type';
import { PROBE_ARGS, PROBE_TIMEOUT_MS } from './tools-main.constants';
import { readVersion } from './read-version';
import { runToolCall } from './run-tool-call';

const failed = (err: unknown): ToolProbeResult => ({ ok: false, version: null, error: err instanceof Error ? err.message : String(err) });

const runProbe = async (def: ToolSpec, probe: ToolProbe, paths: Record<string, string>): Promise<ToolProbeResult> => {
  const binary = probe.binary ?? def.binaries[0] ?? '';
  const file = paths[binary];
  if (file === undefined) return { ok: false, version: null, error: `${def.label} has no ${binary} to check` };
  const output = await runToolCall(def, { binary, file, args: probe.args ?? PROBE_ARGS, options: { timeoutMs: probe.timeoutMs ?? PROBE_TIMEOUT_MS } });
  return (probe.read ?? readVersion)(output);
};

const probeTool = async (def: ToolSpec, paths: Record<string, string>): Promise<ToolProbeResult> => {
  const { probe } = def;
  if (!probe) return { ok: true, version: null };
  try {
    return typeof probe === 'function' ? await probe(paths) : await runProbe(def, probe, paths);
  } catch (err) {
    return failed(err);
  }
};

export { probeTool };
