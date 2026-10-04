/* @layer electron-main @kind test */
import { EventEmitter } from 'events';
import type { Rect, SimInsets, SimWindowOptions } from './window-sim.type';

const DISPLAY = { id: 1, bounds: { x: 0, y: 0, width: 1920, height: 1080 }, workArea: { x: 0, y: 0, width: 1920, height: 1040 }, scaleFactor: 2 };
const WINDOWS_INSETS: SimInsets = { left: 6, top: 0, right: 6, bottom: 6 };
const BEHIND_TASKBAR = ['floating', 'torn-off-menu', 'modal-panel', 'main-menu', 'status'];

const cursor = { x: 0, y: 0 };
const sims = new Map<object, FakeWindow>();

const copy = (r: Rect): Rect => ({ x: r.x, y: r.y, width: r.width, height: r.height });

class FakeWebContents extends EventEmitter {
  sent: { channel: string; args: unknown[] }[] = [];
  isDestroyed = (): boolean => false;
  send = (channel: string, ...args: unknown[]): void => {
    this.sent.push({ channel, args });
  };
  sendInputEvent = (): void => undefined;
}

class FakeWindow extends EventEmitter {
  readonly name: string;
  readonly insets: SimInsets;
  readonly webContents = new FakeWebContents();
  bounds: Rect;
  min: { width: number; height: number };
  resizing = false;
  pending: Rect | null = null;
  setCalls = 0;
  private destroyed = false;
  private visible = true;
  private onTop = false;
  private parent: FakeWindow | null = null;

  constructor(options: SimWindowOptions = {}) {
    super();
    this.name = options.title ?? 'window';
    this.bounds = { x: options.x ?? 0, y: options.y ?? 0, width: options.width ?? 800, height: options.height ?? 600 };
    this.min = { width: options.minWidth ?? 0, height: options.minHeight ?? 0 };
    this.insets = options.insets ?? WINDOWS_INSETS;
    sims.set(this, this);
  }

  getBounds = (): Rect => copy(this.bounds);
  getNormalBounds = (): Rect => copy(this.bounds);
  getContentBounds = (): Rect => ({ x: this.bounds.x + 1, y: this.bounds.y, width: this.bounds.width - 1, height: this.bounds.height });
  getSize = (): number[] => [this.bounds.width, this.bounds.height];
  getMinimumSize = (): number[] => [this.min.width, this.min.height];

  setBounds = (next: Partial<Rect>): void => {
    this.setCalls += 1;
    const wanted = { ...this.bounds, ...next };
    if (this.resizing) this.pending = copy(wanted);
    this.place(wanted);
  };

  takePending = (): Rect | null => {
    const pending = this.pending;
    this.pending = null;
    return pending;
  };

  setSize = (width: number, height: number): void => this.setBounds({ width, height });

  place = (wanted: Rect): void => {
    const next = { ...wanted, width: Math.max(wanted.width, this.min.width), height: Math.max(wanted.height, this.min.height) };
    const before = this.bounds;
    this.bounds = copy(next);
    if (before.width !== next.width || before.height !== next.height) this.emit('resize');
    if (before.x !== next.x || before.y !== next.y) this.emit('move');
  };

  isDestroyed = (): boolean => this.destroyed;
  isVisible = (): boolean => this.visible;
  isMinimized = (): boolean => false;
  isMaximized = (): boolean => false;
  isFullScreen = (): boolean => false;
  isFocused = (): boolean => false;
  isAlwaysOnTop = (): boolean => this.onTop;
  pinLevels: string[] = [];
  setAlwaysOnTop = (on: boolean, level = 'floating'): void => {
    this.pinLevels.push(level);
    this.onTop = on && !(process.platform === 'win32' && BEHIND_TASKBAR.includes(level));
  };
  getParentWindow = (): FakeWindow | null => this.parent;
  setParentWindow = (parent: FakeWindow | null): void => {
    this.parent = parent;
  };
  setSkipTaskbar = (): void => undefined;
  setOpacity = (): void => undefined;
  setAspectRatio = (): void => undefined;
  setFullScreen = (): void => undefined;
  unmaximize = (): void => undefined;
  moveTop = (): void => undefined;
  focus = (): void => undefined;
  show = (): void => {
    this.visible = true;
  };
  showInactive = (): void => {
    this.visible = true;
  };
  hide = (): void => {
    this.visible = false;
  };
  destroy = (): void => {
    if (this.destroyed) return;
    this.destroyed = true;
    this.emit('closed');
  };

  close = (): void => this.destroy();
}

const simOf = (win: object): FakeWindow => {
  const sim = sims.get(win);
  if (!sim) throw new Error('not a simulated window');
  return sim;
};

const resetSim = (): void => {
  for (const sim of sims.values()) sim.removeAllListeners();
  sims.clear();
  cursor.x = 0;
  cursor.y = 0;
};

const fakeElectron = {
  BrowserWindow: FakeWindow,
  screen: {
    getCursorScreenPoint: () => ({ ...cursor }),
    getDisplayMatching: () => DISPLAY,
    getDisplayNearestPoint: () => DISPLAY,
    getPrimaryDisplay: () => DISPLAY,
    getAllDisplays: () => [DISPLAY],
    on: (): void => undefined,
  },
  app: { on: (): void => undefined, getPath: (): string => '.', isPackaged: false },
  nativeImage: { createEmpty: () => ({}) },
};

export { FakeWindow, cursor, fakeElectron, resetSim, simOf };
