/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createI18n } from '@drizztdourden08/brock-core/i18n';
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import { brockMainLayer } from '../src/main/i18n/brock-main-layer';
import { installMainI18n } from '../src/main/i18n/install-main-i18n';
import { watchLocale } from '../src/main/i18n/watch-locale';
import { createTrayControl } from '../src/main/tray/create-tray-control';

interface Item { label?: string; type?: string }
interface FakeTray { menu: unknown; tip: string }

const shared = vi.hoisted(() => ({ trays: [] as FakeTray[], appMenus: [] as unknown[] }));

vi.mock('../src/main/window/dev-server-url', () => ({ devServerUrl: () => null }));
vi.mock('electron', () => ({
  app: { getAppPath: () => '/app' },
  nativeImage: { createEmpty: () => ({ isEmpty: () => false }), createFromPath: () => ({ isEmpty: () => false, resize: () => ({ isEmpty: () => false }) }) },
  Menu: {
    buildFromTemplate: (template: unknown) => ({ template }),
    setApplicationMenu: (menu: unknown) => { shared.appMenus.push(menu); },
  },
  Tray: class {
    state: FakeTray = { menu: null, tip: '' };
    constructor() { shared.trays.push(this.state); }
    setImage(): void { /* fake */ }
    setToolTip(tip: string): void { this.state.tip = tip; }
    setContextMenu(menu: unknown): void { this.state.menu = menu; }
    on(): void { /* fake */ }
    isDestroyed(): boolean { return false; }
    destroy(): void { /* fake */ }
  },
}));

const fr: Layer = {
  locale: 'fr',
  namespace: 'brock-main',
  messages: { 'tray.show': 'Afficher {name}', 'tray.quit': 'Quitter', 'edit.menu': 'Edition', 'edit.copy': 'Copier' },
};

const labelsOf = (menu: unknown): Array<string | undefined> => (menu as { template: Item[] }).template.map((item) => item.label);

beforeEach(() => {
  shared.trays.length = 0;
  shared.appMenus.length = 0;
});

describe('I1 main surfaces follow the locale', { tags: ['standard'] }, () => {
  it('rebuilds the tray menu and the edit menu with the new labels', async () => {
    const i18n = createI18n({ base: 'en', layers: [brockMainLayer], load: async () => [fr] });
    installMainI18n(i18n);
    const tray = createTrayControl({ productName: 'Bxel', icon: '/icons/app.ico', show: () => Promise.resolve(), quit: vi.fn(), log: vi.fn() });
    tray.set({ tooltip: 'Bxel' });
    watchLocale(i18n);
    expect(labelsOf(shared.trays[0]?.menu)).toEqual(['Show Bxel', undefined, 'Quit']);

    await i18n.setLocale('fr');

    expect(labelsOf(shared.trays[0]?.menu)).toEqual(['Afficher Bxel', undefined, 'Quitter']);
    const appMenu = shared.appMenus.at(-1) as { template: Array<{ label: string; submenu: Item[] }> };
    expect(appMenu.template[0]?.label).toBe('Edition');
    expect(appMenu.template[0]?.submenu.map((item) => item.label)).toEqual(['Undo', 'Redo', undefined, 'Cut', 'Copier', 'Paste', 'Select All']);
  });
});
