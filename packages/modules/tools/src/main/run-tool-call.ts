/* @layer electron-main @kind logic */
import type { ToolRunCall, ToolRunNext, ToolRunResult, ToolSpec } from './tools-main.type';
import { runBinary } from './run-binary';

const plainRun: ToolRunNext = (call) => runBinary(call.file, call.args, call.options);

const runToolCall = (def: ToolSpec, call: ToolRunCall): Promise<ToolRunResult> =>
  (def.aroundRun ? def.aroundRun(call, plainRun) : plainRun(call));

export { runToolCall };
