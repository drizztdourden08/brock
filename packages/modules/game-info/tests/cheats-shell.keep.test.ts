/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { activeTabOf } from '../src/views/CheatsShell/behavior/active-tab-of';
import { descPrefKey } from '../src/views/GameInfoWidget/behavior/desc-pref-key';

const tabs = [
  { id: 'player', label: 'Player', render: () => null },
  { id: 'items', label: 'Items', render: () => null },
];

describe('K2 activeTabOf', { tags: ['critical'] }, () => {
  it('gives the stored tab when it exists', () => {
    expect(activeTabOf(tabs, 'items', 'player')?.id).toBe('items');
  });

  it('falls back to the preferred tab, then the first', () => {
    expect(activeTabOf(tabs, 'gone', 'items')?.id).toBe('items');
    expect(activeTabOf(tabs, 'gone', undefined)?.id).toBe('player');
  });

  it('gives nothing for no tabs', () => {
    expect(activeTabOf([], 'player', undefined)).toBeUndefined();
  });
});

describe('K2 descPrefKey', { tags: ['critical'] }, () => {
  it('keys a described row by its trimmed lower case label', () => {
    expect(descPrefKey(' NPC Blockers ')).toBe('desc:npc blockers');
  });
});
