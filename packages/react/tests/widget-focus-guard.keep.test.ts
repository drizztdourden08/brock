/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useWidgetsNeverFocus } from '../src/widgets/WidgetHost/behavior/useWidgetsNeverFocus';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

const PAGE = `
  <div data-widget-id="cheats">
    <button id="widget-button"><svg id="widget-icon"></svg></button>
    <input id="widget-slider" type="range" min="0" max="10" value="5">
    <select id="widget-select"><option>One</option><option>Two</option></select>
    <input id="widget-text" type="text">
    <p id="widget-text-line">Some text</p>
  </div>
  <div class="listbox-drop control-menu widget-options">
    <button id="options-row" aria-controls="options-sub">Shortcuts</button>
  </div>
  <div class="control-menu__sub-panel" id="options-sub"><button id="options-sub-item">Keys</button></div>
  <div class="control-menu__panel"><button id="menu-item" role="menuitem">Settings</button></div>
  <div class="control-menu__sub-panel" id="menu-sub"><button id="menu-sub-item">Theme</button></div>
  <button id="palette-row">Open the Cheats widget</button>
  <div id="host"></div>
`;

let root: Root | null = null;

const byId = (id: string): HTMLElement => {
  const element = document.getElementById(id);
  if (!element) throw new Error(`no #${id}`);
  return element;
};

const Guard = (props: { enabled: boolean }) => {
  useWidgetsNeverFocus(props.enabled);
  return null;
};

const mount = (enabled = true): void => {
  root = createRoot(byId('host'));
  act(() => root?.render(createElement(Guard, { enabled })));
};

const focusable = (target: Element): HTMLElement | null => target.closest<HTMLElement>('button, input, select, textarea, [tabindex]');

const pressDown = (target: Element): boolean => {
  target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
  const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 });
  target.dispatchEvent(down);
  if (!down.defaultPrevented) focusable(target)?.focus();
  return down.defaultPrevented;
};

const release = (target: Element): void => {
  target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
  target.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, button: 0 }));
  target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 }));
};

const click = (target: Element): boolean => {
  const prevented = pressDown(target);
  release(target);
  return prevented;
};

const tabTo = (target: HTMLElement): void => {
  (document.activeElement ?? document.body).dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
  target.focus();
};

beforeEach(() => {
  document.body.innerHTML = PAGE;
});

afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = '';
});

describe('the widget focus guard', () => {
  it('keeps a pointer click on a widget button from leaving the focus there, and the click still fires', () => {
    mount();
    const button = byId('widget-button');
    let clicks = 0;
    button.addEventListener('click', () => { clicks += 1; });
    expect(click(byId('widget-icon'))).toBe(true);
    expect(document.activeElement).not.toBe(button);
    expect(clicks).toBe(1);
  });

  it('drops focus that a widget press moves onto a widget control afterwards', () => {
    mount();
    click(byId('widget-button'));
    byId('widget-button').focus();
    expect(document.activeElement).not.toBe(byId('widget-button'));
  });

  it('lets a slider and a select hold the focus during the press and drops it on release or change', () => {
    mount();
    const slider = byId('widget-slider');
    expect(pressDown(slider)).toBe(false);
    expect(document.activeElement).toBe(slider);
    release(slider);
    expect(document.activeElement).not.toBe(slider);

    const select = byId('widget-select');
    pressDown(select);
    expect(document.activeElement).toBe(select);
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.activeElement).not.toBe(select);
  });

  it('keeps a text field focused after a click', () => {
    mount();
    const text = byId('widget-text');
    expect(click(text)).toBe(false);
    expect(document.activeElement).toBe(text);
  });

  it('leaves a press on plain widget text alone, so the text stays selectable', () => {
    mount();
    expect(pressDown(byId('widget-text-line'))).toBe(false);
  });

});

describe('the widget focus guard and the rest of the app', () => {
  it('keeps the focus a keyboard user moves into a widget with Tab, also on a slider they change', () => {
    mount();
    click(byId('widget-button'));
    tabTo(byId('widget-button'));
    expect(document.activeElement).toBe(byId('widget-button'));
    tabTo(byId('widget-slider'));
    byId('widget-slider').dispatchEvent(new Event('change', { bubbles: true }));
    expect(document.activeElement).toBe(byId('widget-slider'));
  });

  it('keeps the focus that a click outside the widgets, as on a search result, moves into a widget', () => {
    mount();
    click(byId('palette-row'));
    byId('widget-button').focus();
    expect(document.activeElement).toBe(byId('widget-button'));
  });

  it('covers the widget options panel and its sub-panel', () => {
    mount();
    expect(click(byId('options-row'))).toBe(true);
    expect(click(byId('options-sub-item'))).toBe(true);
    expect(document.activeElement).not.toBe(byId('options-sub-item'));
  });

  it('leaves a click in an app menu and its sub-menu untouched', () => {
    mount();
    expect(click(byId('menu-item'))).toBe(false);
    expect(document.activeElement).toBe(byId('menu-item'));
    expect(click(byId('menu-sub-item'))).toBe(false);
    expect(document.activeElement).toBe(byId('menu-sub-item'));
  });

  it('changes nothing with the option off', () => {
    mount(false);
    expect(click(byId('widget-button'))).toBe(false);
    expect(document.activeElement).toBe(byId('widget-button'));
    const slider = byId('widget-slider');
    click(slider);
    expect(document.activeElement).toBe(slider);
  });

  it('stops guarding when it unmounts', () => {
    mount();
    act(() => root?.unmount());
    root = null;
    expect(click(byId('widget-button'))).toBe(false);
    expect(document.activeElement).toBe(byId('widget-button'));
  });
});
