/* @layer electron-main @kind logic */
import { app, ipcMain, session } from 'electron';
import type { ProductConfig } from '@drizztdourden08/brock-core/product';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { BootstrapOptions } from '../types/main-context.type';
import type { ReadyInput } from './bootstrap-app.type';
import { applyPortableMode } from '../app/portable-mode';
import { applyUserDataArg } from '../app/user-data-arg';
import { installCrashForensics } from '../crash-forensics/install';
import { noteSync } from '../crash-forensics/note-sync';
import { stackOf } from '../crash-forensics/stack-of';
import { parseInstanceConfig } from '../instance/instance-config';
import { applyInstanceIdentity } from '../instance/instance-identity';
import { registerPrivilegedSchemes } from '../protocol/privileged-schemes';
import { initPaths } from '../paths/init-paths';
import { ensureDataDirectories } from '../paths/ensure-data-directories';
import { installDevFileLogging } from '../logs/dev-file-logger';
import { resolveWindowIcon } from '../window/window-icon';
import { createWindow } from '../window/create-window';
import { installEditMenu } from '../window/edit-menu';
import { setSplashStatus } from '../boot/set-splash-status';
import { rotateSessionLog } from '../handlers/rotate-session-log';
import { createMainContext } from './create-main-context';
import { resolvePaths } from './resolve-paths';
import { baseHandlers } from './base-handlers';
import { registerHandlerGroups } from './register-handlers';
import { armScreenshotFlag } from './screenshot-flag';
import { installAppLifecycle } from './app-lifecycle';
import { logBoot } from './boot-timing';

const onReady = async ({ ctx, options, dataDirs, openWindow }: ReadyInput): Promise<void> => {
  const modules = options.modules ?? [];
  if (ctx.isDev) await session.defaultSession.clearCache();

  initPaths(app.getPath('userData'));
  await ensureDataDirectories(dataDirs);
  await rotateSessionLog();

  registerHandlerGroups(baseHandlers(options), ctx);
  for (const module of modules) await module.register(ctx);
  registerHandlerGroups(options.handlers ?? [], ctx);
  await options.onReady?.(ctx);

  const win = openWindow();
  logBoot('window created');
  if (ctx.isDev) await installDevFileLogging(win);
  installEditMenu();
  win.webContents.once('did-finish-load', () => {
    logBoot('renderer did-finish-load');
    setSplashStatus('Preparing interface...');
  });
  ipcMain.once('window:shellReady', () => logBoot('shell-ready (reveal)'));
  armScreenshotFlag(ctx);

  for (const module of modules) module.onWindow?.(win, ctx);
  options.onWindow?.(win, ctx);
};

const bootstrapApp = (product: ProductConfig, options: BootstrapOptions = {}): void => {
  const modules = options.modules ?? [];
  const portableData = applyPortableMode();
  const userDataOverride = applyUserDataArg();
  app.setName(product.id);
  installCrashForensics();

  const flags = createAutomationFlags([
    ...modules.flatMap((m) => m.automationFlags ?? []),
    ...(options.automationFlags ?? []),
  ]);
  const instance = parseInstanceConfig();
  const icon = resolveWindowIcon(product.icons, instance.name, options.instanceIcons);
  applyInstanceIdentity(instance.name, { appId: product.appId, iconPath: icon });
  registerPrivilegedSchemes([...product.schemes, ...modules.flatMap((m) => m.schemes ?? [])]);
  app.commandLine.appendSwitch('disable-features', 'CalculateNativeWinOcclusion');

  const ctx = createMainContext({ product, flags, instance, profileHooks: options.profileHooks });
  const paths = resolvePaths(options.paths);
  const dataDirs = [...product.dataDirs, ...modules.flatMap((m) => m.dataDirs ?? [])];
  const openWindow = (): Electron.BrowserWindow => createWindow({
    product, flags, instance, paths, icon,
    version: app.getVersion(),
    rendererFlags: options.rendererFlags,
    security: options.security,
  });

  if (portableData) ctx.log(`user data lives beside the app: ${portableData}`);
  if (userDataOverride) ctx.log(`user data redirected by flag: ${userDataOverride}`);

  void app.whenReady()
    .then(() => onReady({ ctx, options, dataDirs, openWindow }))
    .catch((err: unknown) => {
      noteSync('error', `boot failed: ${stackOf(err)}`);
      app.exit(1);
    });

  installAppLifecycle({ ctx, modules, onWillQuit: options.onWillQuit, recreateWindow: openWindow });
};

export { bootstrapApp };
