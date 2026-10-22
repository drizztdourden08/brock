/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { MainContext } from '../src/main/types/main-context.type';
import { memoByContext } from '../src/main/context/memo-by-context';

const contextWith = () => ({ files: {} as MainContext['files'] });

describe('memoByContext', () => {
  it('builds once for the context and every copy of it', () => {
    const create = vi.fn(() => ({}));
    const get = memoByContext(create);
    const ctx = contextWith();
    const copy = { ...ctx };

    expect(get(copy)).toBe(get(ctx));
    expect(create).toHaveBeenCalledTimes(1);
  });

  it('keeps separate values for separate apps', () => {
    const get = memoByContext(() => ({}));
    expect(get(contextWith())).not.toBe(get(contextWith()));
  });
});
