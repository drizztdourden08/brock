/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { defineProduct } from '../src/product/define-product';

const BASE = { id: 'my-app', name: 'My App', appId: 'com.example.my-app', author: { name: 'someone' } };

describe('product.boot', () => {
  it('leaves the watchdog to the defaults when it is not set', () => {
    expect(defineProduct(BASE).boot).toBeUndefined();
  });

  it('keeps a watchdog for development and one for the packaged app', () => {
    expect(defineProduct({ ...BASE, boot: { devWatchdogMs: 300_000, watchdogMs: 15_000 } }).boot).toEqual({ devWatchdogMs: 300_000, watchdogMs: 15_000 });
  });

  it('refuses a watchdog that is not a positive whole number of milliseconds', () => {
    expect(() => defineProduct({ ...BASE, boot: { devWatchdogMs: 0 } })).toThrow(/product\.boot\.devWatchdogMs 0/);
    expect(() => defineProduct({ ...BASE, boot: { watchdogMs: 1.5 } })).toThrow(/product\.boot\.watchdogMs 1\.5/);
  });
});
