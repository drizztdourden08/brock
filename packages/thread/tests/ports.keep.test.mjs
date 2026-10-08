/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { derivePortBase, freePortSlot, portFor, portSlotOf, PORT_SLOT_ENV } from '../src/ports/index.mjs';
import { parseSlot } from '../src/ports/parse-slot.mjs';

describe('portFor', () => {
  it('puts the main checkout renderer on the base', () => {
    expect(portFor(4100, 0)).toBe(4100);
  });

  it('moves a slot N block to base + 10 x N and keeps the offset', () => {
    expect(portFor(4100, 3)).toBe(4130);
    expect(portFor(4100, 3, 5)).toBe(4135);
  });

  it('refuses an offset outside the block, a negative slot and a base too high', () => {
    expect(() => portFor(4100, 0, 10)).toThrow(/offset/);
    expect(() => portFor(4100, -1)).toThrow(/slot/);
    expect(() => portFor(65500, 0)).toThrow(/base/);
  });
});

describe('derivePortBase', () => {
  it('is stable, a multiple of 200 and inside the documented range', () => {
    for (const id of ['my-app', 'atlas', 'sample-app', 'a']) {
      const base = derivePortBase(id);
      expect(derivePortBase(id)).toBe(base);
      expect(base % 200).toBe(0);
      expect(base).toBeGreaterThanOrEqual(20000);
      expect(base).toBeLessThanOrEqual(47800);
    }
  });

  it('spreads ids apart', () => {
    expect(derivePortBase('my-app')).not.toBe(derivePortBase('atlas'));
  });
});

describe('slots', () => {
  it('hands out the lowest free slot from 1', () => {
    expect(freePortSlot([])).toBe(1);
    expect(freePortSlot([1, 2, 4])).toBe(3);
  });

  it('refuses when every slot is taken', () => {
    const all = [...Array(19).keys()].map((i) => i + 1);
    expect(() => freePortSlot(all)).toThrow(/taken/);
  });

  it('parses a slot file and ignores junk', () => {
    expect(parseSlot('4\n')).toBe(4);
    expect(parseSlot('')).toBeNull();
    expect(parseSlot('-2')).toBeNull();
    expect(parseSlot('x')).toBeNull();
  });

  it('lets the environment pick the slot', () => {
    expect(portSlotOf(process.cwd(), { [PORT_SLOT_ENV]: '7' })).toBe(7);
  });
});
