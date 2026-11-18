/* @layer renderer-shell @kind logic */
import type { SettingsItem } from '@drizztdourden08/tessera/composites';
import { chordKeys } from '../../chord-keys';
import { chordOfKeys } from '../../chord-of-keys';
import { chordsOf } from '../../chords-of';
import { commands } from '../../commands';
import type { CommandDef, KeymapRowInput } from '../../command.type';
import { formatChord } from '../../format-chord';

const notes = (def: CommandDef, extra: readonly string[], input: KeymapRowInput): string[] => {
  const { state, shared, labelOf, t } = input;
  const sameKeys = shared
    .filter((each) => each.ids.includes(def.id))
    .flatMap((each) => each.ids.filter((id) => id !== def.id));
  return [
    ...(def.only === undefined ? [] : [t('brock-settings:keymap.only', { where: def.only })]),
    ...(sameKeys.length === 0 ? [] : [t('brock-settings:keymap.sameKeys', { names: [...new Set(sameKeys)].map(labelOf).join(', ') })]),
    ...(extra.length > 0 ? [t('brock-settings:keymap.also', { keys: extra.map((chord) => formatChord(chord, state.mac)).join(', ') })] : []),
    ...(def.hold === undefined ? [] : [t('brock-settings:keymap.hold')]),
  ];
};

const keymapRow = (def: CommandDef, input: KeymapRowInput): SettingsItem => {
  const { state, clashes, labelOf, t } = input;
  const { mac } = state;
  const [first = '', ...extra] = chordsOf(def, state);
  const others = clashes.filter((clash) => clash.ids.includes(def.id)).flatMap((clash) => clash.ids).filter((id) => id !== def.id);
  const lines = notes(def, extra, input);
  const description = lines.length > 0 ? { description: lines.join(' ') } : { noDescription: true as const };
  return {
    id: def.id,
    title: def.label,
    hint: t('brock-settings:keymap.hint'),
    ...description,
    input: {
      kind: 'keybind',
      value: chordKeys(first, mac),
      onChange: (keys) => {
        const chord = chordOfKeys(keys, mac);
        if (chord !== null) commands.remap(def.id, [chord]);
      },
    },
    changed: state.overrides[def.id] !== undefined,
    onReset: () => commands.reset(def.id),
    problem: others.length > 0 ? t('brock-settings:keymap.conflict', { names: [...new Set(others)].map(labelOf).join(', ') }) : undefined,
    actions: first === '' ? [] : [{ id: 'clear', label: t('brock-settings:keymap.clear'), onSelect: () => commands.remap(def.id, []) }],
  };
};

export { keymapRow };
