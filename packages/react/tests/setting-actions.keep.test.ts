/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { isValidElement } from 'react';
import { settingRows } from '../src/settings/SettingsLayout/behavior/setting-rows';
import { settingRow } from '../src/settings/SettingsLayout/behavior/setting-row';
import { SettingActions } from '../src/settings/SettingsLayout/sub-components/SettingActions';
import type { SettingItem } from '../src/settings/settings.type';
import { confirmDelete } from '../src/stores/confirm-delete';
import { dialogs } from '../src/stores/dialogs';
import { useDialogStore } from '../src/stores/useDialogStore';

const context = (settings: Record<string, unknown> = {}) => ({ settings, onChange: vi.fn(), disabled: false, lock: null });

const OWNER: SettingItem = {
  key: 'owner',
  label: 'Owner id',
  description: 'Identifies you to archipelago.gg.',
  hint: 'Copy it to share, or reset it to get a new one.',
  actions: [
    { id: 'copy', label: 'Copy', icon: 'copy', onSelect: () => undefined },
    { id: 'reset', label: 'Reset', variant: 'danger', confirm: { title: 'Reset?', message: 'A new id is made.' }, onSelect: () => undefined },
  ],
};

afterEach(() => {
  useDialogStore.setState({ dialog: null });
});

describe('settings row actions', () => {
  it('draws an item with actions and no control as a custom input holding the action buttons', () => {
    const row = settingRow(OWNER, context());
    expect(row).toMatchObject({ id: 'owner', title: 'Owner id', hint: OWNER.hint, input: { kind: 'custom' } });
    const control = row && 'input' in row && row.input.kind === 'custom' ? row.input.control : null;
    expect(isValidElement(control) && control.type === SettingActions).toBe(true);
    expect(settingRows(OWNER, context())).toHaveLength(1);
  });

  it('keeps the control of an item that has one and adds the actions as a row under it', () => {
    const item: SettingItem = { ...OWNER, key: 'site', control: { kind: 'text', placeholder: 'https://' } };
    const rows = settingRows(item, context({ site: 'https://archipelago.gg' }));
    expect(rows.map((row) => row.id)).toEqual(['site', 'site:actions']);
    expect(rows[0]).toMatchObject({ input: { kind: 'text', value: 'https://archipelago.gg' } });
    expect(rows[1]).toMatchObject({ hint: OWNER.hint, noDescription: true });
  });

  it('still draws nothing for an item with neither a control nor actions', () => {
    expect(settingRows({ ...OWNER, key: 'nothing', actions: [] }, context())).toEqual([]);
  });
});

describe('confirmDelete', () => {
  it('asks with the danger look and Cancel focused, and resolves the choice', async () => {
    const answer = confirmDelete({ what: '12 runs', consequence: 'Their output files go too.' });
    expect(useDialogStore.getState().dialog).toMatchObject({
      title: 'Delete 12 runs?', message: 'Their output files go too.', confirmLabel: 'Delete', variant: 'danger', focus: 'cancel',
    });
    useDialogStore.getState().dialog?.onConfirm();
    await expect(answer).resolves.toBe(true);
    const second = confirmDelete({ what: 'the cache', consequence: 'It is rebuilt.' });
    useDialogStore.getState().dialog?.onCancel?.();
    await expect(second).resolves.toBe(false);
  });

  it('keeps the deprecated callback form working with the same focus', () => {
    dialogs.confirmDelete('Delete preset?', 'It cannot be undone.', () => undefined);
    expect(useDialogStore.getState().dialog).toMatchObject({ variant: 'danger', focus: 'cancel', confirmLabel: 'Delete' });
  });
});
