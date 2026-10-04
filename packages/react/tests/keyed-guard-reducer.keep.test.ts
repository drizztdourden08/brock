/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { keyedGuardReducer } from '../src/hooks/keyed-guard-reducer';
import { IDLE_GUARD } from '../src/hooks/keyed-guard.constants';
import { lastGuardError } from '../src/hooks/last-guard-error';

describe('keyedGuardReducer', () => {
  it('marks a key busy and clears its old error', () => {
    const failed = keyedGuardReducer(IDLE_GUARD, { type: 'fail', key: 'save', message: 'disk full' });
    const next = keyedGuardReducer(failed, { type: 'start', key: 'save' });
    expect(next).toEqual({ busy: { save: true }, errors: {} });
  });

  it('keeps keys apart', () => {
    let state = keyedGuardReducer(IDLE_GUARD, { type: 'start', key: 'a' });
    state = keyedGuardReducer(state, { type: 'start', key: 'b' });
    state = keyedGuardReducer(state, { type: 'fail', key: 'a', message: 'nope' });
    expect(state).toEqual({ busy: { b: true }, errors: { a: 'nope' } });
    state = keyedGuardReducer(state, { type: 'done', key: 'b' });
    expect(state).toEqual({ busy: {}, errors: { a: 'nope' } });
  });

  it('clears one error or all of them', () => {
    let state = keyedGuardReducer(IDLE_GUARD, { type: 'fail', key: 'a', message: 'x' });
    state = keyedGuardReducer(state, { type: 'fail', key: 'b', message: 'y' });
    expect(keyedGuardReducer(state, { type: 'clear', key: 'a' }).errors).toEqual({ b: 'y' });
    expect(keyedGuardReducer(state, { type: 'clear' }).errors).toEqual({});
  });

  it('reads the most recent error as lastError', () => {
    expect(lastGuardError(IDLE_GUARD)).toBeNull();
    let state = keyedGuardReducer(IDLE_GUARD, { type: 'fail', key: 'a', message: 'first' });
    state = keyedGuardReducer(state, { type: 'fail', key: 'b', message: 'second' });
    expect(lastGuardError(state)).toBe('second');
    state = keyedGuardReducer(state, { type: 'fail', key: 'a', message: 'third' });
    expect(lastGuardError(state)).toBe('third');
    state = keyedGuardReducer(state, { type: 'clear', key: 'a' });
    expect(lastGuardError(state)).toBe('second');
  });
});
