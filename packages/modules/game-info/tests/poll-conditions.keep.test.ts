/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { shouldPoll } from '../src/runtime/poll-conditions';

const gate = { kind: 'locked' } as never;

describe('K2 shouldPoll', { tags: ['critical'] }, () => {
  it('polls only when running, open and visible', () => {
    expect(shouldPoll({ coreStatus: 'running', gate: null, visible: true })).toBe(true);
  });

  it('stops when the core is not running', () => {
    expect(shouldPoll({ coreStatus: 'idle', gate: null, visible: true })).toBe(false);
  });

  it('stops when the gate is closed', () => {
    expect(shouldPoll({ coreStatus: 'running', gate, visible: true })).toBe(false);
  });

  it('stops when the widget is hidden', () => {
    expect(shouldPoll({ coreStatus: 'running', gate: null, visible: false })).toBe(false);
  });
});
