/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { commands } from '../src/commands/commands';
import { listCommands } from '../src/commands/list-commands';
import { useCommandStore } from '../src/commands/useCommandStore';
import type { ContextMenuContext } from '../src/context-menu/context-menu.type';
import { resolveEntries } from '../src/context-menu/resolve-entries';
import type { MenuItem } from '../src/menu/menu.type';
import { withCommandChords } from '../src/menu/with-command-chords';
import { registerFresh } from './command-fixtures';

const context: ContextMenuContext = { point: { x: 0, y: 0 }, target: null, trigger: 'pointer', data: undefined };

describe('menus read the gates of a command', () => {
  let ready = false;
  let shown = true;
  let unregister = (): void => {};

  beforeEach(() => {
    ready = false;
    shown = true;
    unregister = registerFresh([
      { id: 'edit.paste', label: 'Paste', reason: () => (ready ? null : 'Nothing to paste.'), run: () => undefined },
      { id: 'map.fill', label: 'Fill map', visible: () => shown, run: () => undefined },
    ]);
  });

  afterEach(() => unregister());

  const lookup = (id: string): readonly string[] | undefined => commands.chords(id);

  it('shows the reason of a disabled command on its app menu item and disables it', () => {
    const [paste] = withCommandChords([{ key: 'paste', label: 'Paste', command: 'edit.paste' }], lookup, commands.describe) as MenuItem[];
    expect(paste).toMatchObject({ disabled: true, description: 'Nothing to paste.' });
    ready = true;
    const [again] = withCommandChords([{ key: 'paste', label: 'Paste', command: 'edit.paste' }], lookup, commands.describe) as MenuItem[];
    expect(again?.disabled).not.toBe(true);
  });

  it('drops the menu item of a hidden command and keeps the rest', () => {
    const items = [{ key: 'fill', label: 'Fill', command: 'map.fill' }, { key: 'paste', label: 'Paste', command: 'edit.paste' }];
    shown = false;
    expect(withCommandChords(items, lookup, commands.describe).map((entry) => (entry as MenuItem).key)).toEqual(['paste']);
    shown = true;
    expect(withCommandChords(items, lookup, commands.describe)).toHaveLength(2);
  });

  it('shows the reason on a context menu entry and drops a hidden command', () => {
    const view = () => ({ defs: new Map(listCommands(useCommandStore.getState()).map((def) => [def.id, def])), state: useCommandStore.getState(), context });
    const nodes = resolveEntries(['edit.paste', 'map.fill'], view());
    expect(nodes).toMatchObject([{ label: 'Paste', disabled: true, description: 'Nothing to paste.' }, { label: 'Fill map' }]);
    shown = false;
    expect(resolveEntries(['edit.paste', 'map.fill'], view())).toHaveLength(1);
  });

  it('lets an entry reason win over the reason of the command', () => {
    const view = { defs: new Map(listCommands(useCommandStore.getState()).map((def) => [def.id, def])), state: useCommandStore.getState(), context };
    expect(resolveEntries([{ command: 'edit.paste', reason: 'Copy something first.' }], view)).toMatchObject([{ description: 'Copy something first.' }]);
  });
});
