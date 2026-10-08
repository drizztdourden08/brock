/* @layer core @kind constants */
import type { InvokeContract, SendContract, EventContract } from '../augment';
import { WIDGET_EVENT_MAP, WIDGET_INVOKE_MAP, WIDGET_SEND_MAP } from './widget-maps.constants';
import { DATA_EVENT_MAP, DATA_INVOKE_MAP, DATA_SEND_MAP } from './data-maps.constants';

const BASE_INVOKE_MAP = {
  getUserDataPath: 'app:getUserDataPath',
  getAppVersion: 'app:getVersion',
  takeOpenRequests: 'app:takeOpens',
  getSystemDiagnostics: 'diagnostics:getSystem',
  getProcessDiagnostics: 'diagnostics:getProcesses',
  getBugReportTransport: 'bugReport:transport',
  sendBugReport: 'bugReport:send',
  getLanAddresses: 'network:lanAddresses',

  getDataLocation: 'storage:getLocation',
  revealDataFolder: 'storage:reveal',
  revealProfileFolder: 'storage:revealProfile',
  getStorageSummary: 'storage:getSummary',

  fileReadBytes: 'file:readBytes',
  fileReadText: 'file:readText',
  fileWriteBytes: 'file:writeBytes',
  fileWriteText: 'file:writeText',
  fileList: 'file:list',
  fileRemove: 'file:remove',
  fileExists: 'file:exists',
  fileMkdir: 'file:mkdir',
  fileStat: 'file:stat',

  isMaximized: 'window:isMaximized',
  setAlwaysOnTop: 'window:setAlwaysOnTop',
  isFullscreen: 'window:isFullscreen',

  pickFile: 'dialog:pickFile',
  pickPath: 'dialog:pickPath',
  saveFile: 'dialog:saveFile',

  openFolder: 'shell:openFolder',
  revealPath: 'shell:revealPath',

  listProfiles: 'profiles:list',
  createProfile: 'profiles:create',
  deleteProfile: 'profiles:delete',
  setLastProfile: 'profiles:setLast',
  getAppState: 'profiles:getAppState',
  updateLastPlayed: 'profiles:updateLastPlayed',
  updateProfile: 'profiles:update',

  readConfig: 'config:read',
  writeConfig: 'config:write',

  listSessions: 'sessions:list',
  saveSession: 'sessions:save',

  loadUiViews: 'uiViews:load',
  saveUiViews: 'uiViews:save',

  revealLogsFolder: 'debug:revealLogs',

  takeScreenshot: 'test:screenshot',
  reviewCapture: 'review:capture',
  ...WIDGET_INVOKE_MAP,
  ...DATA_INVOKE_MAP,
} as const satisfies Record<string, keyof InvokeContract>;

const BASE_SEND_MAP = {
  minimize: 'window:minimize',
  maximize: 'window:maximize',
  close: 'window:close',
  openDevTools: 'window:openDevTools',
  toggleFullscreen: 'window:toggleFullscreen',
  setFullscreen: 'window:setFullscreen',
  setAspectRatioLock: 'window:setAspectRatioLock',
  bootProgress: 'boot:progress',
  bootFailed: 'boot:failed',
  bootReady: 'boot:ready',
  appendSessionLog: 'debug:appendSessionLog',
  reviewCheck: 'review:check',
  reviewFinish: 'review:finish',
  ...WIDGET_SEND_MAP,
  ...DATA_SEND_MAP,
} as const satisfies Record<string, keyof SendContract>;

const BASE_EVENT_MAP = {
  onMaximizedChange: 'window:maximized',
  onFullscreenChange: 'window:fullscreen',
  onLogEntry: 'log:entry',
  onImportProgress: 'import:progress',
  onAppOpen: 'app:open',
  ...WIDGET_EVENT_MAP,
  ...DATA_EVENT_MAP,
} as const satisfies Record<string, keyof EventContract>;

export { BASE_INVOKE_MAP, BASE_SEND_MAP, BASE_EVENT_MAP };
