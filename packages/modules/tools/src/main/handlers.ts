/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { finalizeRecording } from './recording/finalize-recording';
import type { ToolsMain } from './tools-main.type';

const registerToolsHandlers = ({ handle, paths }: Pick<MainContext, 'handle' | 'paths'>, tools: ToolsMain): void => {
  handle('tools:list', () => tools.list());
  handle('tools:state', (_event, id) => tools.state(id));
  handle('tools:install', (_event, id) => tools.install(id));
  handle('tools:finalizeRecording', (_event, input) => finalizeRecording(tools, { paths }, input));
};

export { registerToolsHandlers };
