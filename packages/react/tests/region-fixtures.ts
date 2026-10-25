/* @layer renderer-shell @kind test */
import { afterEach, beforeEach } from 'vitest';
import { shellCommands } from '../src/app/BrockApp/behavior/shell-commands';
import { dispatchCommand } from '../src/commands/dispatch-command';
import { focusRegion } from '../src/regions/focus-region';
import { registerFresh } from './command-fixtures';

const SHELL = `
  <div role="banner" aria-label="Title bar"><button id="menu">Menu</button></div>
  <nav aria-label="Screens"><button id="rail">Home</button></nav>
  <div role="toolbar" aria-label="Tools"><button id="tool-a" tabindex="-1">A</button><button id="tool-b" tabindex="0">B</button></div>
  <main aria-label="Main"><p>Reading only</p></main>
`;

const press = (init: KeyboardEventInit, target: EventTarget = document): void => {
  document.addEventListener('keydown', (each) => dispatchCommand(each, null), { once: true });
  target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }));
};

const next = (target?: EventTarget): void => press({ key: 'F6', code: 'F6' }, target);

const previous = (): void => press({ key: 'F6', code: 'F6', shiftKey: true });

const mount = (html: string): void => {
  document.body.innerHTML = html;
};

const focusedId = (): string | undefined => document.activeElement?.id;

const markRegion = (element: HTMLElement | null, id: string, label: string): void => {
  const marks = focusRegion(id, label);
  element?.setAttribute('data-focus-region', marks['data-focus-region']);
  element?.setAttribute('role', marks.role);
  element?.setAttribute('aria-label', marks['aria-label']);
};

const useShellRegionCommands = (): void => {
  let unregister = (): void => {};
  beforeEach(() => {
    unregister = registerFresh(shellCommands(undefined));
  });
  afterEach(() => {
    unregister();
    document.body.replaceChildren();
  });
};

export { focusedId, markRegion, mount, next, previous, SHELL, useShellRegionCommands };
