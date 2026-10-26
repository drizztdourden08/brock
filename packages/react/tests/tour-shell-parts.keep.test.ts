/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { tourTargets } from '../src/tours/resolve-tour-target';
import type { TourShellPart } from '../src/tours/tour.type';

const SHELL =
  '<nav class="side-nav side-nav--rail" aria-label="Screens"><button>Home</button></nav>' +
  '<nav class="side-nav side-nav--panel" aria-label="Sections"></nav>' +
  '<main class="brock-app__screens">' +
  '<div class="screen-host__home"><section class="hero" id="home-hero"></section></div>' +
  '<div class="screen-layer"><div class="screen-layer__card" id="card"><nav class="side-nav" id="hub-nav"></nav><div class="side-nav-layout__pane" id="pane"></div></div></div>' +
  '</main>';

const find = (shell: TourShellPart): HTMLElement | null => tourTargets.resolve({ shell });

afterEach(() => {
  document.body.replaceChildren();
});

describe('tour shell parts', () => {
  it('lights the screen pane, the screens rail and the home hero, each on its own', () => {
    document.body.innerHTML = SHELL;
    expect(find('page')).toBe(document.querySelector('main.brock-app__screens'));
    expect(find('rail')).toBe(document.querySelector('nav[aria-label="Screens"]'));
    expect(find('hero')).toBe(document.getElementById('home-hero'));
  });

  it('keeps screen on the open screen card', () => {
    document.body.innerHTML = SHELL;
    expect(find('screen')).toBe(document.getElementById('card'));
  });

  it('lights the hero of the open hub when the home screen has none', () => {
    document.body.innerHTML = SHELL;
    document.querySelector('.screen-host__home')?.replaceChildren();
    document.getElementById('pane')?.insertAdjacentHTML('beforeend', '<section class="hero" id="hub-hero"></section>');
    expect(find('hero')).toBe(document.getElementById('hub-hero'));
    document.querySelector('.screen-layer')?.classList.add('screen-layer--hidden');
    expect(find('hero')).toBeNull();
  });

  it('finds nothing for a part that is not on screen, as for any missing part', () => {
    document.body.innerHTML = '<main class="brock-app__screens"></main>';
    expect(find('rail')).toBeNull();
    expect(find('hero')).toBeNull();
    expect(find('page')).toBe(document.querySelector('.brock-app__screens'));
    expect(find('screen')).toBeNull();
  });
});
