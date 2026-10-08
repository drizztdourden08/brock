/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { ToolsMain } from './tools-main.type';

const registerToolsHandlers = ({ handle }: Pick<MainContext, 'handle'>, tools: ToolsMain): void => {
  handle('tools:list', () => tools.list());
  handle('tools:state', (_event, id) => tools.state(id));
  handle('tools:install', (_event, id) => tools.install(id));
};

export { registerToolsHandlers };
