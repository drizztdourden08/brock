/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { idLabel } from '../src/views/GameInfoWidget/behavior/id-label';

describe('K2 idLabel', { tags: ['critical'] }, () => {
  it('gives the name when present and hex ids are off', () => {
    expect(idLabel({ id: 26, width: 2, name: 'Potion' }, false)).toBe('Potion');
  });

  it('gives the padded hex form when there is no name', () => {
    expect(idLabel({ id: 26, width: 4 }, false)).toBe('0x001A');
    expect(idLabel({ id: 26, width: 4 }, true)).toBe('0x001A');
  });

  it('adds the hex form after the name when hex ids are on', () => {
    expect(idLabel({ id: 26, width: 2, name: 'Potion' }, true)).toBe('Potion (0x1A)');
  });
});
