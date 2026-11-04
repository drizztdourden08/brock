/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { parseHelperArgs } from '../src/helper/helper-args';

describe('I-131 helper args', { tags: ['standard'] }, () => {
  it('reads user data, instance and bridge file', () => {
    expect(parseHelperArgs(['--user-data=.user-data', '--instance=two', '--bridge-file=/tmp/b.json'], {})).toEqual({
      userData: '.user-data',
      instance: 'two',
      file: '/tmp/b.json',
    });
  });

  it('gives nulls when nothing is passed', () => {
    expect(parseHelperArgs([], {})).toEqual({ userData: null, instance: null, file: null });
  });

  it('takes the bridge file from the environment when no flag is given', () => {
    expect(parseHelperArgs([], { BROCK_BRIDGE_FILE: '/env/b.json' }).file).toBe('/env/b.json');
  });

  it('prefers the flag over the environment', () => {
    expect(parseHelperArgs(['--bridge-file=/flag.json'], { BROCK_BRIDGE_FILE: '/env.json' }).file).toBe('/flag.json');
  });

  it('lets the last flag win and treats an empty value as unset', () => {
    expect(parseHelperArgs(['--instance=a', '--instance=b'], {}).instance).toBe('b');
    expect(parseHelperArgs(['--user-data='], {}).userData).toBeNull();
  });

  it('ignores flags it does not know', () => {
    expect(parseHelperArgs(['--other=1', 'plain'], {})).toEqual({ userData: null, instance: null, file: null });
  });
});
