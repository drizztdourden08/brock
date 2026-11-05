/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import type { LobbyEvent } from '../src/archipelago/lobby';
import { formErrorOf } from '../src/renderer/archipelia/check/form-error-of';
import { isSameLobby } from '../src/renderer/archipelia/membership/is-same-lobby';
import { movedRoomUrlsOf } from '../src/renderer/archipelia/membership/moved-room-urls-of';
import { nextMembership } from '../src/renderer/archipelia/membership/next-membership';
import { roomUrlsOf } from '../src/renderer/archipelia/membership/room-urls-of';
import { JOIN_STATE, LOCAL_ROOM, MEMBERSHIP, REMOTE_ROOM, STARTED } from './archipelia-membership.fixture';

const LABELS = { game: 'Toy Game', shortName: 'Toy' };

const stepOf = (event: LobbyEvent, from = MEMBERSHIP) => nextMembership(from, event, JOIN_STATE);

describe('nextMembership', () => {
  it('follows the admission events', () => {
    expect(stepOf({ type: 'admission', state: 'pending', reason: null }).membership.state).toEqual({ kind: 'pending' });
    const refused = stepOf({ type: 'admission', state: 'refused', reason: 'no' }).membership;
    expect(refused.state).toEqual({ kind: 'refused', reason: 'no' });
    expect(refused.token).toBeUndefined();
  });

  it('marks a generation failure and recovers on progress', () => {
    const failed = stepOf({ type: 'generation-failed', stage: 'fill', message: 'boom' }).membership;
    expect(failed.state).toEqual({ kind: 'failed', message: 'boom' });
    const progress = { type: 'progress', progress: { phase: 'generating', step: 'fill', fraction: 0.5 } } as const;
    expect(stepOf(progress, failed).membership.state).toEqual({ kind: 'approved' });
    expect(stepOf(progress).membership).toBe(MEMBERSHIP);
  });

  it('promotes the profile when the lobby starts', () => {
    const step = stepOf({ type: 'started', started: STARTED });
    expect(step.membership.state).toEqual({ kind: 'started' });
    expect(step.promote).toBe(STARTED);
  });

  it('turns a closed lobby into a gone state and drops the token', () => {
    const failure = { code: 'lobby-closed', message: '', forgetToken: true } as const;
    const next = stepOf({ type: 'failed', failure }).membership;
    expect(next.state).toEqual({ kind: 'gone', reason: 'closed' });
    expect(next.token).toBeUndefined();
    expect(stepOf({ type: 'failed', failure: { ...failure, code: 'timeout' } }).membership).toBe(MEMBERSHIP);
  });

  it('reports a moved room and ignores other events', () => {
    expect(stepOf({ type: 'room', state: 'hosting', address: 'host:1234' }).room).toBe('host:1234');
    expect(stepOf({ type: 'ready', ready: true }).membership).toBe(MEMBERSHIP);
  });
});

describe('isSameLobby', () => {
  it('matches the same lobby and refuses another', () => {
    expect(isSameLobby(MEMBERSHIP, 'lobby.example.org', { joinToken: 'join-token-1' })).toBe(true);
    expect(isSameLobby(MEMBERSHIP, 'lobby.example.org', { joinToken: 'join-token-2' })).toBe(false);
    expect(isSameLobby(MEMBERSHIP, 'other.example.org', { joinToken: 'join-token-1' })).toBe(false);
  });
});

describe('room urls', () => {
  it('uses the public address for a remote lobby server', () => {
    expect(roomUrlsOf('lobby.example.org', LOCAL_ROOM)).toEqual({ serverUrl: 'ws://room.example.org:38281' });
  });

  it('prefers the local address on a loopback lobby server', () => {
    expect(roomUrlsOf('localhost:8080', LOCAL_ROOM)).toEqual({
      serverUrl: 'ws://192.168.1.5:38281',
      fallbackServerUrl: 'ws://room.example.org:38281',
    });
    expect(roomUrlsOf('127.0.0.1', REMOTE_ROOM)).toEqual({ serverUrl: 'ws://room.example.org:38281' });
  });

  it('keeps a moved room on loopback only when it was local', () => {
    expect(movedRoomUrlsOf('localhost', 'host:4000', true)).toEqual({ serverUrl: '127.0.0.1:4000', fallbackServerUrl: 'host:4000' });
    expect(movedRoomUrlsOf('localhost', 'host:4000', false)).toEqual({ serverUrl: 'host:4000' });
    expect(movedRoomUrlsOf('lobby.example.org', 'host:4000', true)).toEqual({ serverUrl: 'host:4000' });
    expect(movedRoomUrlsOf('localhost', 'host:name', true)).toEqual({ serverUrl: 'host:name' });
  });
});

describe('formErrorOf', () => {
  it('words the common failures', () => {
    expect(formErrorOf({ code: 'timeout', message: '' }, 'srv', LABELS)).toBe('Could not reach srv.');
    expect(formErrorOf({ code: 'rate-limited', message: '', retryAfter: 5 }, 'srv', LABELS)).toBe('Too many tries. Wait 5 s.');
    expect(formErrorOf({ code: 'lobby-not-found', message: '' }, 'srv', LABELS, { joinToken: 't' })).toBe('This lobby is no longer listed.');
    expect(formErrorOf({ code: 'lobby-not-found', message: '' }, 'srv', LABELS)).toBe('No lobby with this code.');
  });

  it('names the game and the app from the labels', () => {
    expect(formErrorOf({ code: 'game-not-allowed', message: '' }, 'srv', LABELS)).toBe('This lobby does not accept Toy Game.');
    expect(formErrorOf({ code: 'trust-failed', message: '' }, 'srv', LABELS)).toBe('This Toy build could not be verified. Update Toy.');
  });
});
