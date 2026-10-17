/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';
import { SettingsRow } from '@drizztdourden08/tessera/composites';
import type { SettingsRowProps } from '@drizztdourden08/tessera/composites';
import { pointSettingRow } from '../src/review/dom/point-setting-row';

const state: { root: Root | null } = { root: null };

const toggle = (id: string, extra: Partial<SettingsRowProps> = {}, hints?: { on?: string; off?: string; atRest?: boolean }): SettingsRowProps =>
  ({ id, title: id, input: { kind: 'toggle', value: true, onChange: () => undefined, hints }, ...extra }) as SettingsRowProps;

const BULK = toggle('enable-all');
const SOUND = toggle('sound', { hint: 'Plays the interface sounds.' }, { on: 'Every click makes a sound.', off: 'The interface stays silent.' });
const AT_REST = toggle('backups', {}, { on: 'A copy is kept on every save.', off: 'Saves overwrite the last copy.', atRest: true });

const mountRows = (rows: readonly SettingsRowProps[]): HTMLElement => {
  document.body.innerHTML = '<div id="page"></div>';
  const page = document.getElementById('page') as HTMLElement;
  state.root = createRoot(page);
  act(() => state.root?.render(createElement('div', null, ...rows.map((row) => createElement(SettingsRow, { key: row.id, ...row })))));
  return page;
};

afterEach(() => {
  act(() => state.root?.unmount());
  state.root = null;
  document.body.replaceChildren();
});

describe('the review points at a settings row that has hints', () => {
  it('passes over a first toggle row with no hints and points at the next one', async () => {
    const page = mountRows([BULK, SOUND]);
    const pointed = await pointSettingRow(page);
    pointed.leave();
    expect(pointed.found).toBe(true);
    expect(pointed.hint).not.toBeNull();
    expect(pointed.hint).not.toBe('');
  });

  it('reads the current rest line when the pointed hint is one of the hints at rest', async () => {
    const page = mountRows([BULK, AT_REST]);
    expect(page.querySelector('[data-setting-key="backups"] .settings-row__line[data-pointed]')).toBeNull();
    const pointed = await pointSettingRow(page);
    pointed.leave();
    expect(pointed.found).toBe(true);
    expect(pointed.hint).toContain('A copy is kept on every save.');
  });

  it('finds no row, and so nothing to check, on a page whose rows have no hints', async () => {
    const page = mountRows([BULK, toggle('enable-none')]);
    const pointed = await pointSettingRow(page);
    expect(pointed).toMatchObject({ found: false, hint: null });
  });
});
