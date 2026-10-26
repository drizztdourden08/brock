/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { prepareStep } from '../src/tours/prepare-step';
import { tourTargets } from '../src/tours/resolve-tour-target';

const BAR =
  '<header class="window-title-bar"><div class="window-title-bar__start"><button class="dropdown-trigger" aria-expanded="false">Menu</button></div>' +
  '<span data-bar-item="action:more"><button class="dropdown-trigger" aria-expanded="false">More</button></span></header>' +
  '<main class="brock-app__screens"><div class="screen-layer"><div class="settings-page__tabs" id="tabs"></div></div></main>';

const PANEL = '<div role="menu"><button role="menuitem" id="tour"><span class="dropdown__label">Take the tour</span></button><button role="menuitem"><span class="dropdown__label">About</span></button></div>';

const wire = (trigger: Element): void => {
  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    document.querySelector('[role="menu"]')?.remove();
    if (!open) document.body.insertAdjacentHTML('beforeend', PANEL);
  });
};

const step = { id: 's', title: 'S', body: 'B', openMenu: 'menu', target: { menuEntry: 'Take the tour' } };

afterEach(() => {
  document.body.replaceChildren();
});

describe('tabs part and open-menu step', () => {
  it('lights the page tab strip of the open screen', () => {
    document.body.innerHTML = BAR;
    expect(tourTargets.resolve({ shell: 'tabs' })).toBe(document.getElementById('tabs'));
  });

  it('finds a menu entry by its label only while the menu is open', async () => {
    document.body.innerHTML = BAR;
    document.querySelectorAll('.dropdown-trigger').forEach(wire);
    expect(tourTargets.resolve(step.target)).toBeNull();
    const control = new AbortController();
    await prepareStep('t', step, 0, control.signal);
    expect(tourTargets.resolve(step.target)).toBe(document.getElementById('tour'));
    expect(tourTargets.resolve({ menuEntry: 'Missing' })).toBeNull();
    control.abort();
    expect(document.querySelector('[role="menu"]')).toBeNull();
    expect(tourTargets.resolve(step.target)).toBeNull();
  });

  it('opens a bar action menu by its id and leaves an open menu open', async () => {
    document.body.innerHTML = BAR;
    document.querySelectorAll('.dropdown-trigger').forEach(wire);
    const control = new AbortController();
    await prepareStep('t', { ...step, openMenu: 'more' }, 0, control.signal);
    expect(document.querySelector('[data-bar-item="action:more"] .dropdown-trigger')?.getAttribute('aria-expanded')).toBe('true');
    await prepareStep('t', { ...step, openMenu: 'more' }, 0, control.signal);
    expect(document.querySelector('[role="menu"]')).not.toBeNull();
    control.abort();
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });

  it('does nothing when the menu is not on screen', async () => {
    document.body.innerHTML = '<main></main>';
    await prepareStep('t', { ...step, openMenu: 'missing' }, 0, new AbortController().signal);
    expect(document.querySelector('[role="menu"]')).toBeNull();
  });
});
