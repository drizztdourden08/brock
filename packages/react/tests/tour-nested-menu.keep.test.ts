/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { prepareStep } from '../src/tours/prepare-step';
import { tourTargets } from '../src/tours/resolve-tour-target';
import type { TourStepDef } from '../src/tours/tour.type';

const BAR = '<header class="window-title-bar"><div class="window-title-bar__start"><button class="dropdown-trigger" aria-expanded="false">Menu</button></div></header>';

const item = (label: string, id: string, extra = ''): string =>
  `<button role="menuitem" id="${id}" ${extra}><span class="dropdown__label">${label}</span></button>`;

const ROOT = `<div class="dropdown-drop"><div role="menu" id="root">${item('Settings', 'settings')}${item('Advanced', 'advanced', 'aria-haspopup="menu" aria-expanded="false"')}</div></div>`;

const SUB = `<div class="dropdown-menu--sub"><div role="menu" id="sub-advanced">${item('Take the tour', 'tour')}${item('More', 'more', 'aria-haspopup="menu" aria-expanded="false"')}</div></div>`;

const DEEP = `<div class="dropdown-menu--sub"><div role="menu" id="sub-more">${item('Deep entry', 'deep')}</div></div>`;

const wireParent = (parent: Element, sub: string, id: string): void => {
  parent.addEventListener('click', () => {
    if (document.getElementById(id)) return;
    parent.setAttribute('aria-expanded', 'true');
    parent.setAttribute('aria-controls', id);
    parent.insertAdjacentHTML('afterend', sub);
    const panel = document.getElementById(id);
    panel?.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft') return;
      parent.setAttribute('aria-expanded', 'false');
      parent.removeAttribute('aria-controls');
      panel.parentElement?.remove();
    });
    const more = panel?.querySelector('#more');
    if (more) wireParent(more, DEEP, 'sub-more');
  });
};

const wireTrigger = (): void => {
  const trigger = document.querySelector('.dropdown-trigger');
  trigger?.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    document.querySelector('.dropdown-drop')?.remove();
    document.querySelectorAll('.dropdown-menu--sub').forEach((part) => { part.remove(); });
    if (open) return;
    document.body.insertAdjacentHTML('beforeend', ROOT);
    const advanced = document.getElementById('advanced');
    if (advanced) wireParent(advanced, SUB, 'sub-advanced');
  });
};

const stepOf = (menuEntry: string | readonly string[]): TourStepDef => ({ id: 's', title: 'S', body: 'B', openMenu: 'menu', target: { menuEntry } });

const setup = (): void => {
  document.body.innerHTML = BAR;
  wireTrigger();
};

afterEach(() => {
  document.body.replaceChildren();
});

describe('a menu entry in a submenu', () => {
  it('is reached by a path, opening each parent in order', async () => {
    setup();
    const control = new AbortController();
    const step = stepOf(['Advanced', 'Take the tour']);
    expect(tourTargets.resolve(step.target)).toBeNull();
    await prepareStep('t', step, 0, control.signal);
    expect(tourTargets.resolve(step.target)).toBe(document.getElementById('tour'));
  });

  it('is reached by a path two levels deep', async () => {
    setup();
    const step = stepOf(['Advanced', 'More', 'Deep entry']);
    await prepareStep('t', step, 0, new AbortController().signal);
    expect(tourTargets.resolve(step.target)).toBe(document.getElementById('deep'));
  });

  it('is found by its plain label, searching the submenus', async () => {
    setup();
    const step = stepOf('Take the tour');
    await prepareStep('t', step, 0, new AbortController().signal);
    expect(tourTargets.resolve(step.target)).toBe(document.getElementById('tour'));
    const deep = stepOf('Deep entry');
    await prepareStep('t', deep, 0, new AbortController().signal);
    expect(tourTargets.resolve(deep.target)).toBe(document.getElementById('deep'));
  });

  it('keeps a top level entry where it is and opens no submenu', async () => {
    setup();
    const step = stepOf('Settings');
    await prepareStep('t', step, 0, new AbortController().signal);
    expect(tourTargets.resolve(step.target)).toBe(document.getElementById('settings'));
    expect(document.querySelector('.dropdown-menu--sub')).toBeNull();
  });

  it('finds nothing for a missing entry, and a plain search leaves the submenus closed', async () => {
    setup();
    const plain = stepOf('Missing');
    await prepareStep('t', plain, 0, new AbortController().signal);
    expect(tourTargets.resolve(plain.target)).toBeNull();
    expect(document.querySelector('.dropdown-menu--sub')).toBeNull();
    const path = stepOf(['Advanced', 'Missing']);
    await prepareStep('t', path, 0, new AbortController().signal);
    expect(tourTargets.resolve(path.target)).toBeNull();
    expect(tourTargets.resolve({ menuEntry: ['Nowhere', 'Take the tour'] })).toBeNull();
  });

  it('closes the menu and its submenus when the step ends', async () => {
    setup();
    const control = new AbortController();
    await prepareStep('t', stepOf(['Advanced', 'More', 'Deep entry']), 0, control.signal);
    expect(document.getElementById('deep')).not.toBeNull();
    control.abort();
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(document.querySelector('.dropdown-menu--sub')).toBeNull();
  });
});
