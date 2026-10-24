/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createTrayControl } from '../src/main/tray/create-tray-control';
import { defaultTrayMenu } from '../src/main/tray/default-tray-menu';
import { trayMenuTemplate } from '../src/main/tray/tray-menu';

interface FakeTray {
  image: unknown;
  tip: string;
  menu: unknown;
  destroyed: boolean;
  clicks: Array<() => void>;
}

const shared = vi.hoisted(() => ({ trays: [] as FakeTray[], images: [] as string[] }));

vi.mock('electron', () => ({
  app: { getAppPath: () => '/app' },
  nativeImage: {
    createEmpty: () => ({ isEmpty: () => true }),
    createFromPath: (path: string) => {
      shared.images.push(path);
      return { isEmpty: () => path.includes('missing'), resize: () => ({ isEmpty: () => false, resized: true }) };
    },
  },
  Menu: { buildFromTemplate: (template: unknown) => ({ template }) },
  Tray: class {
    state: FakeTray = { image: null, tip: '', menu: null, destroyed: false, clicks: [] };
    constructor(image: unknown) {
      this.state.image = image;
      shared.trays.push(this.state);
    }
    setImage(image: unknown): void { this.state.image = image; }
    setToolTip(tip: string): void { this.state.tip = tip; }
    setContextMenu(menu: unknown): void { this.state.menu = menu; }
    on(_event: string, handler: () => void): void { this.state.clicks.push(handler); }
    isDestroyed(): boolean { return this.state.destroyed; }
    destroy(): void { this.state.destroyed = true; }
  },
}));

const show = vi.fn(() => Promise.resolve());
const quit = vi.fn();
const log = vi.fn();

const control = (icon: string | undefined = '/icons/app.ico') => createTrayControl({ productName: 'Bxel', icon, show, quit, log });
const items = (tray: FakeTray): Array<{ label?: string; type?: string; click?: () => void }> => (tray.menu as { template: Array<{ label?: string; type?: string; click?: () => void }> }).template;

beforeEach(() => {
  shared.trays.length = 0;
  shared.images.length = 0;
  show.mockClear();
  quit.mockClear();
  log.mockClear();
});

describe('the tray', () => {
  it('is off until the app asks', () => {
    const tray = control();
    expect(tray.active).toBe(false);
    expect(shared.trays).toEqual([]);
  });

  it('is created with the tooltip, the app icon and the default menu', () => {
    const tray = control();
    tray.set({ tooltip: 'Bxel is running' });
    expect(tray.active).toBe(true);
    expect(shared.trays).toHaveLength(1);
    expect(shared.images).toEqual(['/icons/app.ico']);
    const [made] = shared.trays;
    expect(made?.tip).toBe('Bxel is running');
    expect(items(made as FakeTray).map((item) => item.label ?? item.type)).toEqual(['Show Bxel', 'separator', 'Quit']);
  });

  it('shows the window on a left click', () => {
    control().set({ tooltip: 'x' });
    shared.trays[0]?.clicks[0]?.();
    expect(show).toHaveBeenCalledTimes(1);
  });

  it('runs the show and quit actions from its menu', () => {
    control().set({ tooltip: 'x' });
    const [shown, , quitItem] = items(shared.trays[0] as FakeTray);
    shown?.click?.();
    quitItem?.click?.();
    expect(show).toHaveBeenCalledTimes(1);
    expect(quit).toHaveBeenCalledTimes(1);
  });

  it('hands an id item to the listeners, until one stops', () => {
    const tray = control();
    const heard: string[] = [];
    const stop = tray.onItem((id) => heard.push(id));
    tray.set({ tooltip: 'x', menu: [{ label: 'Pause', id: 'pause' }, { label: 'Resume', id: 'resume', enabled: false }] });
    const [pause, resume] = items(shared.trays[0] as FakeTray);
    pause?.click?.();
    stop();
    resume?.click?.();
    expect(heard).toEqual(['pause']);
  });

});

describe('the tray over time', () => {
  it('updates the tray in place when set again, and takes a different icon', () => {
    const tray = control();
    tray.set({ tooltip: 'one' });
    tray.set({ tooltip: 'two', icon: '/icons/other.png' });
    expect(shared.trays).toHaveLength(1);
    expect(shared.trays[0]?.tip).toBe('two');
    expect(shared.images).toEqual(['/icons/app.ico', '/icons/other.png']);
  });

  it('is disposed on clear, and can be created again', () => {
    const tray = control();
    tray.set({ tooltip: 'x' });
    tray.clear();
    expect(shared.trays[0]?.destroyed).toBe(true);
    expect(tray.active).toBe(false);
    tray.clear();
    tray.set({ tooltip: 'again' });
    expect(shared.trays).toHaveLength(2);
    expect(tray.active).toBe(true);
  });

  it('warns when the icon does not load, and still creates the tray', () => {
    const tray = control('/icons/missing.png');
    tray.set({ tooltip: 'x' });
    expect(tray.active).toBe(true);
    expect(log).toHaveBeenCalledWith(expect.stringContaining('no icon'), 'warn');
  });

  it('resolves a relative icon against the app folder', () => {
    control().set({ tooltip: 'x', icon: 'build/tray.png' });
    expect(shared.images[0]).toMatch(/app[\\/]build[\\/]tray\.png$/);
  });
});

describe('the tray menu', () => {
  it('turns separators, actions and ids into menu entries', () => {
    const run = { show: vi.fn(), quit: vi.fn(), pick: vi.fn() };
    const template = trayMenuTemplate([...defaultTrayMenu('App'), { label: 'Go', id: 'go' }], run);
    expect(template.map((entry) => entry.label ?? entry.type)).toEqual(['Show App', 'separator', 'Quit', 'Go']);
    template[3]?.click?.(undefined as never, undefined, undefined as never);
    expect(run.pick).toHaveBeenCalledWith('go');
  });
});
