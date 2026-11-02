/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HeaderActions } from '../src/hub/HeaderActions';
import { hubHeader } from '../src/screens/conventions/hub-header';
import { showHarness } from './show-harness';

afterEach(showHarness.resetShow);

const buttons = (): HTMLButtonElement[] => [...document.querySelectorAll<HTMLButtonElement>('.header-actions button')];

describe('S1 header secondary action', () => {
  it('calls its own action when it is clicked', { tags: ['standard'] }, () => {
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

  it('carries the screen meta through to the hub header', { tags: ['critical'] }, () => {
    const header = hubHeader({ secondary: { label: 'Join a session', open: 'join' }, primary: { label: 'New', open: 'new' } });
    expect(header?.secondary).toMatchObject({ label: 'Join a session', open: 'join' });
    expect(hubHeader({ primary: { label: 'New', open: 'new' } })?.secondary).toBeUndefined();
  });
});
