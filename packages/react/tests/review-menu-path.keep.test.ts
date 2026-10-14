/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { pickMenuPath } from '../src/review/menu/pick-menu-path';

const menu = vi.hoisted(() => ({ closed: 0 }));

vi.mock('../src/review/menu/open-menu', () => ({ openMenu: () => Promise.resolve(document.querySelector<HTMLElement>('.menu')) }));
vi.mock('../src/review/menu/close-menu', () => ({ closeMenu: () => { menu.closed += 1; return Promise.resolve(); } }));
vi.mock('../src/review/dom/wait-for', () => ({ waitFor: <T>(probe: () => T) => Promise.resolve(probe()) }));

afterEach(() => {
  menu.closed = 0;
  document.body.replaceChildren();
});

const drawMenu = (): void => {
  document.body.innerHTML = [
    '<div class="menu" role="menu">',
    '  <div class="dropdown__item" role="menuitem"><span class="dropdown__label">Advanced</span>',
    '    <div role="menu"><button class="dropdown__item" role="menuitem"><span class="dropdown__label">HUD layout</span></button></div>',
    '  </div>',
    '</div>',
  ].join('');
};

describe('pickMenuPath', () => {
  it('closes the menu when the path is not there, so the next Escape reaches the screen and not a menu left open', async () => {
    drawMenu();
    expect(await pickMenuPath(['Advanced', 'Controllers'])).toBe(false);
    expect(await pickMenuPath(['Missing'])).toBe(false);
    expect(menu.closed).toBe(2);
  });
});
