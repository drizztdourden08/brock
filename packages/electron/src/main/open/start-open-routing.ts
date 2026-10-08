/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { PrivilegedScheme } from '@drizztdourden08/brock-core/product';
import type { BootstrapOptions, MainContext } from '../types/main-context.type';
import { whenRevealed } from '../boot/when-revealed';
import { stackOf } from '../crash-forensics/stack-of';
import { installLinuxIntegration } from '../os-integration/install-linux-integration';
import { serveDataSchemes } from '../protocol/serve-data-schemes';
import { openRouter } from './open-router';

const startOpenRouting = (ctx: MainContext, options: BootstrapOptions, schemes: readonly PrivilegedScheme[]): void => {
  serveDataSchemes(schemes, ctx.paths.data);
  const { onOpen } = options;
  if (onOpen) openRouter.onOpen((request) => onOpen(request, ctx));
  const appImage = process.env.APPIMAGE;
  if (process.platform === 'linux' && app.isPackaged && appImage && !ctx.flags.isAutomationLaunch()) {
    void installLinuxIntegration(ctx.product, appImage).catch((err: unknown) => ctx.log(`desktop entry not written: ${stackOf(err)}`, 'warn'));
  }
  void whenRevealed().then(() => openRouter.ready((request) => ctx.emit('app:open', request)));
};

export { startOpenRouting };
