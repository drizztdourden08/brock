/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HeaderActions } from '../src/hub/HeaderActions';
import { hubHeader } from '../src/screens/conventions/hub-header';
import { showHarness } from './show-harness';

afterEach(showHarness.resetShow);

const buttons = (): HTMLButtonElement[] => [...document.querySelectorAll<HTMLButtonElement>('.header-actions button')];

describe('header secondary action', () => {
  it('draws a secondary button before the primary button', () => {
    showHarness.render(createElement(HeaderActions, {
      secondary: { label: 'Join a session', onClick: () => undefined },
      primary: { label: 'New session', onClick: () => undefined },
    }));
    expect(buttons().map((button) => button.textContent)).toEqual(['Join a session', 'New session']);
    expect(document.querySelectorAll('.header-actions .btn--primary')).toHaveLength(1);
    expect(buttons()[0]?.classList.contains('btn--primary')).toBe(false);
    expect(buttons()[1]?.classList.contains('btn--primary')).toBe(true);
  });

  it('calls its own action when it is clicked', () => {
    const join = vi.fn();
    const create = vi.fn();
    showHarness.render(createElement(HeaderActions, {
      secondary: { label: 'Join a session', onClick: join },
      primary: { label: 'New session', onClick: create },
    }));
    buttons()[0]?.click();
    expect(join).toHaveBeenCalledTimes(1);
    expect(create).not.toHaveBeenCalled();
  });

  it('is absent when it is not set', () => {
    showHarness.render(createElement(HeaderActions, { primary: { label: 'New session', onClick: () => undefined } }));
    expect(buttons().map((button) => button.textContent)).toEqual(['New session']);
  });

  it('carries the screen meta through to the hub header', () => {
    const header = hubHeader({ secondary: { label: 'Join a session', open: 'join' }, primary: { label: 'New', open: 'new' } });
    expect(header?.secondary).toMatchObject({ label: 'Join a session', open: 'join' });
    expect(hubHeader({ primary: { label: 'New', open: 'new' } })?.secondary).toBeUndefined();
  });
});
