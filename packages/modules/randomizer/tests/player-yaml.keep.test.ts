/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { exportedOptionsOf } from '../src/archipelago/export';
import { playerFileOf, renderPlayerYaml, withDeathLink } from '../src/archipelago/player-yaml';
import type { PlayerYamlInput } from '../src/archipelago/player-yaml';

const schemaRows = exportedOptionsOf([
  {
    key: 'sword_mode', kind: 'choice', displayName: 'Sword', description: 'How swords arrive.', baseline: 'progressive',
    choices: [{ value: 'progressive' }, { value: 'random' }], locked: false,
  },
  { key: 'death_link', kind: 'toggle', displayName: 'Death link', description: 'Share deaths.', baseline: false, locked: false },
]);

const inputOf = (over: Partial<PlayerYamlInput> = {}): PlayerYamlInput => ({
  game: 'Toy', slotName: 'Link', schemaRows, values: { sword_mode: 'progressive', death_link: false }, ...over,
});

const lineOf = (yaml: string, key: string): string | undefined =>
  yaml.split('\n').find((line) => line.trimStart().startsWith(`${key}:`))?.trim();

describe('the player file', { tags: ['critical'] }, () => {
  it('writes a choice valued random as its id, which the package reads back as random', () => {
    const yaml = renderPlayerYaml(inputOf({ values: { sword_mode: 'random' } }));
    expect(lineOf(yaml, 'sword_mode')).toBe('sword_mode: 1');
    expect(lineOf(renderPlayerYaml(inputOf()), 'sword_mode')).toBe('sword_mode: progressive');
    expect(yaml).not.toMatch(/:\s*random\s*$/m);
  });

  it('writes death_link from the profile toggle over the frozen row', () => {
    expect(lineOf(renderPlayerYaml(inputOf({ deathLink: true })), 'death_link')).toBe('death_link: true');
    const frozenOn = inputOf({ values: { death_link: true }, deathLink: false });
    expect(lineOf(renderPlayerYaml(frozenOn), 'death_link')).toBe('death_link: false');
    expect(withDeathLink({ death_link: true })).toEqual({ death_link: true });
  });

  it('names the slot Player when none is typed and lets the game edit the block', () => {
    const file = playerFileOf({ ...inputOf({ block: (block) => ({ ...block, sword_mode: 'progressive' }) }), slotName: '  ' });
    expect(file.slotName).toBe('Player');
    expect(lineOf(file.yaml, 'sword_mode')).toBe('sword_mode: progressive');
  });
});
