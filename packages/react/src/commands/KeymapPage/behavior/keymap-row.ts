/* @layer renderer-shell @kind logic */
import type { SettingsItem } from '@drizztdourden08/tessera/composites';
import { chordKeys } from '../../chord-keys';
import { chordOfKeys } from '../../chord-of-keys';
import { chordsOf } from '../../chords-of';
import { commands } from '../../commands';
import type { CommandDef, KeymapRowInput } from '../../command.type';
import { formatChord } from '../../format-chord';
import { KEYMAP_STRINGS } from '../KeymapPage.constants';

const keymapRow = (def: CommandDef, input: KeymapRowInput): SettingsItem => {
  const { state, clashes, labelOf } = input;
  const { mac } = state;
  const [first = '', ...extra] = chordsOf(def, state);
  const others = clashes.filter((clash) => clash.ids.includes(def.id)).flatMap((clash) => clash.ids).filter((id) => id !== def.id);
  const description = extra.length > 0 ? { description: `${KEYMAP_STRINGS.also} ${extra.map((chord) => formatChord(chord, mac)).join(', ')}.` } : { noDescription: true as const };
  return {
    id: def.id,
    title: def.label,
    hint: KEYMAP_STRINGS.hint,
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
    problem: others.length > 0 ? `${KEYMAP_STRINGS.conflict} ${[...new Set(others)].map(labelOf).join(', ')}.` : undefined,
    actions: first === '' ? [] : [{ id: 'clear', label: KEYMAP_STRINGS.clear, onSelect: () => commands.remap(def.id, []) }],
  };
};

export { keymapRow };
