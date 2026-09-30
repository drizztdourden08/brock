/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { heroChecks } from '../src/review/checks/hero-checks';

describe('heroChecks', () => {
  it('passes a hero with a title and filled slots', () => {
    const outcomes = heroChecks({ hub: 'game', rendered: true, title: 'Brock App', slots: ['eyebrow', 'actions', 'facts'] });
    expect(outcomes.every((o) => o.pass)).toBe(true);
    expect(outcomes.find((o) => o.id === 'game-hero-slots')?.reason).toBe('the hero fills eyebrow, actions, facts');
  });

  it('fails a home that did not render the composite', () => {
    expect(heroChecks({ hub: 'game', rendered: false, title: '', slots: [] }).map((o) => [o.id, o.pass])).toEqual([['game-hero-renders', false]]);
  });

  it('fails an empty title and a hero with nothing but its title', () => {
    const failed = heroChecks({ hub: 'game', rendered: true, title: '', slots: [] }).filter((o) => !o.pass).map((o) => o.id);
    expect(failed).toEqual(['game-hero-title', 'game-hero-slots']);
  });
});
