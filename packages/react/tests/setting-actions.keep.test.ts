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
  it('draws an item with actions and no control as a row with SettingsRow actions and no input', () => {
    const row = settingRow(OWNER, context());
    expect(row).toMatchObject({ id: 'owner', title: 'Owner id', hint: OWNER.hint });
    expect(row).not.toHaveProperty('input');
    const actions = row && 'actions' in row ? row.actions ?? [] : [];
    expect(actions.map((action) => [action.id, action.label, action.tone])).toEqual([['copy', 'Copy', undefined], ['reset', 'Reset', 'danger']]);
    expect(settingRows(OWNER, context())).toHaveLength(1);
  });

  it('keeps the control of an item that has one and puts the actions in the same row', () => {
    const item: SettingItem = { ...OWNER, key: 'site', control: { kind: 'text', placeholder: 'https://' } };
    const rows = settingRows(item, context({ site: 'https://archipelago.gg' }));
    expect(rows.map((row) => row.id)).toEqual(['site']);
    expect(rows[0]).toMatchObject({ input: { kind: 'text', value: 'https://archipelago.gg' }, actions: [{ id: 'copy' }, { id: 'reset' }] });
  });

  it('asks a string confirm in the row, and a dialog confirm through confirmAction before it runs', async () => {
    const forget = vi.fn();
    const reset = vi.fn();
    const item: SettingItem = {
      ...OWNER,
      actions: [
        { id: 'forget', label: 'Forget', variant: 'danger', confirm: 'Forget it?', onSelect: forget },
        { id: 'reset', label: 'Reset', confirm: { title: 'Reset?', message: 'A new id is made.' }, onSelect: reset },
      ],
    };
    const row = settingRow(item, context());
    const [inline, dialog] = row && 'actions' in row ? row.actions ?? [] : [];
    expect(inline?.confirm).toBe('Forget it?');
    expect(dialog?.confirm).toBeUndefined();
    inline?.onClick();
    await vi.waitFor(() => expect(forget).toHaveBeenCalledOnce());
    dialog?.onClick();
    await vi.waitFor(() => expect(useDialogStore.getState().dialog).toMatchObject({ title: 'Reset?' }));
    expect(reset).not.toHaveBeenCalled();
    useDialogStore.getState().dialog?.onConfirm();
    await vi.waitFor(() => expect(reset).toHaveBeenCalledOnce());
  });

  it('hands the current settings to onSelect and to a disabled function', async () => {
    const onSelect = vi.fn();
    const item: SettingItem = { ...OWNER, actions: [{ id: 'rebuild', label: 'Rebuild', disabled: (values) => values.cache === 0, onSelect }] };
    const empty = settingRow(item, context({ cache: 0 }));
    expect(empty && 'actions' in empty ? empty.actions?.[0]?.disabled : null).toBe(true);
    const full = settingRow(item, context({ cache: 12 }));
    const [rebuild] = full && 'actions' in full ? full.actions ?? [] : [];
    expect(rebuild?.disabled).toBe(false);
    rebuild?.onClick();
    await vi.waitFor(() => expect(onSelect).toHaveBeenCalledWith({ cache: 12 }));
  });

  it('keeps SettingActions for a custom control, under it in the same row', () => {
    const row = settingRow(OWNER, { ...context(), renderControl: () => 'custom' });
    const content = row && 'content' in row ? row.content : null;
    expect(isValidElement(content)).toBe(true);
    const children = isValidElement<{ children: unknown[] }>(content) ? content.props.children : [];
    expect(children.some((child) => isValidElement(child) && child.type === SettingActions)).toBe(true);
  });

  it('still draws nothing for an item with neither a control nor actions', () => {
    expect(settingRows({ ...OWNER, key: 'nothing', actions: [] }, context())).toEqual([]);
  });
});

describe('confirmDelete', () => {
  it('asks with the danger look, which Tessera starts on Cancel, and resolves the choice', async () => {
    const answer = confirmDelete({ what: '12 runs', consequence: 'Their output files go too.' });
    expect(useDialogStore.getState().dialog).toMatchObject({
      title: 'Delete 12 runs?', message: 'Their output files go too.', confirmLabel: 'Delete', variant: 'danger',
    });
    useDialogStore.getState().dialog?.onConfirm();
    await expect(answer).resolves.toBe(true);
    const second = confirmDelete({ what: 'the cache', consequence: 'It is rebuilt.' });
    useDialogStore.getState().dialog?.onCancel?.();
    await expect(second).resolves.toBe(false);
  });

  it('keeps the deprecated callback form working with the danger look', () => {
    dialogs.confirmDelete('Delete preset?', 'It cannot be undone.', () => undefined);
    expect(useDialogStore.getState().dialog).toMatchObject({ variant: 'danger', confirmLabel: 'Delete' });
  });
});
