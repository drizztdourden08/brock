/* @layer renderer-shell @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import type { RandomizerModeId } from '../src/augment';
import type { ConnectionBody, ConnectionView } from '../src/contract/connection-view.type';
import type { RandomizerGame } from '../src/contract/randomizer-game.type';
import type { RandomizerViews } from '../src/contract/randomizer-views.type';
import { useRandomizerGameStore } from '../src/renderer/game-registry/behavior/useRandomizerGameStore';
import { connectionShown } from '../src/renderer/online/connection-step/connection-shown';
import { connectionSummary } from '../src/renderer/online/connection-step/connection-summary';
import { connectionValidate } from '../src/renderer/online/connection-step/connection-validate';

const LOBBY = 'lobby' as string as RandomizerModeId;
const Body: ConnectionBody = () => null;

const register = (views: RandomizerViews): void =>
  useRandomizerGameStore.getState().register({ id: 'toy', views } as RandomizerGame<unknown>);

const lobbyViews = (entry: ConnectionBody | ConnectionView): RandomizerViews => ({ connection: { [LOBBY]: entry } });

const valuesFor = (mode: RandomizerModeId, connection: Record<string, unknown> = {}) => ({
  randomizer: { enabled: true, seed: '', mode },
  randomizerConnection: connection,
});

const seatView: ConnectionView = {
  Body,
  validate: (connection) => (connection.seat === undefined ? 'Pick a seat.' : null),
  summary: (connection) => `Seat ${String(connection.seat)}`,
};

describe('connection step for any mode', { tags: ['critical'] }, () => {
  afterEach(() => useRandomizerGameStore.setState({ game: null }));

  it('shows for a custom mode with a views.connection entry', () => {
    register(lobbyViews(Body));
    expect(connectionShown(valuesFor(LOBBY))).toBe(true);
  });

  it('stays hidden for a custom mode without an entry', () => {
    register({ connection: {} });
    expect(connectionShown(valuesFor(LOBBY))).toBe(false);
  });

  it('runs the per mode validate and summary on the connection slice', () => {
    register(lobbyViews(seatView));
    expect(connectionValidate(valuesFor(LOBBY))).toBe('Pick a seat.');
    expect(connectionValidate(valuesFor(LOBBY, { seat: 2 }))).toBeNull();
    expect(connectionSummary(valuesFor(LOBBY, { seat: 2 }))).toBe('Seat 2');
  });

  it('keeps online tied to the Archipelago game', () => {
    register({});
    expect(connectionShown(valuesFor('online'))).toBe(false);
  });
});
