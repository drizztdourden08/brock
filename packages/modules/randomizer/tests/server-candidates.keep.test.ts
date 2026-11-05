/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { serverCandidates } from '../src/archipelago';
import { LOCAL_ADDRESSES, ONLINE_ADDRESSES } from './server-candidates.fixture';

describe('server candidates', { tags: ['critical'] }, () => {
  it.each(LOCAL_ADDRESSES)('tries local %s over plain ws only', (address) => {
    expect(serverCandidates(address)).toEqual([`ws://${address}`]);
  });

  it.each(ONLINE_ADDRESSES)('tries online %s over wss first, then ws', (address) => {
    expect(serverCandidates(address)).toEqual([`wss://${address}`, `ws://${address}`]);
  });

  it('keeps a scheme the address names, local or not', () => {
    expect(serverCandidates('wss://localhost:38281')).toEqual(['wss://localhost:38281']);
    expect(serverCandidates(' ws://archipelago.gg:38281 ')).toEqual(['ws://archipelago.gg:38281']);
  });

  it('offers nothing for a blank address', () => {
    expect(serverCandidates('   ')).toEqual([]);
  });
});
