/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { SecretsMain } from './secrets-main.type';

const registerSecretsHandlers = ({ handle }: Pick<MainContext, 'handle'>, secrets: SecretsMain): void => {
  handle('secrets:set', (_event, name, value, label) => secrets.set(name, value, label));
  handle('secrets:has', (_event, name) => secrets.has(name));
  handle('secrets:list', () => secrets.list());
  handle('secrets:delete', (_event, name) => secrets.delete(name));
  handle('secrets:canStore', () => secrets.canStore());
  handle('secrets:signIn:begin', (_event, providerId) => secrets.signIn.begin(providerId));
  handle('secrets:signIn:cancel', (_event, providerId) => { secrets.signIn.cancel(providerId); });
};

export { registerSecretsHandlers };
