/* @layer electron-main @kind logic */
import { shell } from 'electron';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { UpdaterMain, UpdaterOptions, UpdaterRuntime } from './updater-main.type';
import { applyVersion } from './apply-version';
import { createManagerCache } from './create-manager-cache';
import { createPrefsStore } from './create-prefs-store';
import { currentVersion } from './current-version';
import { errorMessage } from './error-message';
import { refreshVersions } from './refresh-versions';
import { releasePageUrl } from './release-page-url';
import { resolveFeed } from './resolve-feed';
import { runCheck } from './run-check';
import { updaterCapabilities } from './updater-capabilities';

const createUpdater = async (ctx: MainContext, options: UpdaterOptions): Promise<UpdaterMain> => {
  const channel = options.channel ?? ctx.product.updateChannel;
  const feed = resolveFeed(ctx, channel);
  const prefsStore = createPrefsStore(ctx.files);
  const managerFor = createManagerCache(feed, channel);
  const state: UpdaterRuntime['state'] = { prefs: await prefsStore.read(), available: null, versions: [] };
  const rt: UpdaterRuntime = { ctx, feed, state, manager: () => managerFor(state.prefs.allowPrerelease) };
  let timer: ReturnType<typeof setTimeout> | null = null;

  const check = (): Promise<ReturnType<UpdaterMain['available']>> => runCheck(rt);

  return {
    capabilities: () => updaterCapabilities(rt),
    currentVersion: () => currentVersion(rt),
    available: () => state.available,
    check,
    listVersions: async () => (await refreshVersions(rt)).map(({ plan: _plan, ...option }) => option),
    apply: (version) => applyVersion(rt, version),
    openReleasePage: (version) => (feed ? shell.openExternal(releasePageUrl(feed, version)) : Promise.resolve()),
    getPrefs: () => state.prefs,
    setPrefs: async (prefs) => {
      state.prefs = prefs;
      await prefsStore.write(prefs);
      await refreshVersions(rt);
    },
    scheduleFirstCheck: (delayMs) => {
      if (timer || !updaterCapabilities(rt).canCheck) return;
      timer = setTimeout(() => {
        check().catch((err: unknown) => ctx.log(`updater: startup check failed: ${errorMessage(err)}`, 'warn'));
      }, delayMs);
    },
    dispose: () => {
      if (timer) clearTimeout(timer);
    },
  };
};

export { createUpdater };
