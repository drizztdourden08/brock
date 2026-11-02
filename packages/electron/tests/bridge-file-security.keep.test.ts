/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import type { Koffi } from '../src/main/os-integration/koffi.type';
import { readFileSecurity } from '../src/main/bridge/read-file-security';

const SIDS: Record<string, string> = { '1,1,0,0,0,0,0,5,18,0,0,0': 'S-1-5-18', '1,1,0,0,0,0,0,5,32,0,0,0': 'S-1-5-32-544', 'owner': 'S-1-5-32-544' };

const aceBytes = (type: number, sid: number[]): number[] => [type, 0, 8 + sid.length, 0, 0, 0, 0, 0, ...sid];

const aclOf = (aces: number[][]): number[] => {
  const body = aces.flat();
  return [2, 0, 8 + body.length, 0, aces.length, 0, 0, 0, ...body];
};

const native = vi.hoisted(() => ({ koffi: null as Koffi | null, acl: [] as number[], code: 0, freed: [] as unknown[] }));

vi.mock('../src/main/os-integration/load-koffi', () => ({ loadKoffi: () => native.koffi }));

const fakeKoffi = (): Koffi => {
  const textOf = (sid: unknown): string => (sid instanceof Uint8Array ? [...sid].join(',') : String(sid));
  const decode = Object.assign(
    (_pointer: unknown, _type: string, length = 1): unknown => native.acl.slice(0, length),
    { string16: (pointer: unknown): string => SIDS[String(pointer).replace('text:', '')] ?? 'unknown' },
  );
  const funcs: Record<string, (...args: unknown[]) => unknown> = {
    GetNamedSecurityInfoW: (...args) => {
      (args[3] as unknown[])[0] = 'owner';
      (args[5] as unknown[])[0] = native.acl.length > 0 ? 'dacl' : null;
      (args[7] as unknown[])[0] = 'descriptor';
      return native.code;
    },
    ConvertSidToStringSidW: (sid, text) => {
      (text as unknown[])[0] = `text:${textOf(sid)}`;
      return 1;
    },
    LocalFree: (pointer) => {
      native.freed.push(pointer);
      return null;
    },
  };
  return { load: () => ({ func: (signature: string) => funcs[/(\w+)\(/.exec(signature)?.[1] ?? ''] ?? (() => null) }), decode };
};

const SYSTEM_SID = [1, 1, 0, 0, 0, 0, 0, 5, 18, 0, 0, 0];
const ADMIN_SID = [1, 1, 0, 0, 0, 0, 0, 5, 32, 0, 0, 0];

describe('K4 the Windows security read through koffi', { tags: ['critical'] }, () => {
  it('reads the owner and each access entry as a SID, and frees every buffer it was given', () => {
    native.koffi = fakeKoffi();
    native.acl = aclOf([aceBytes(0, SYSTEM_SID), aceBytes(1, ADMIN_SID), aceBytes(2, ADMIN_SID)]);
    native.freed = [];
    expect(readFileSecurity('C:\\bridge.json')).toEqual({
      ownerSid: 'S-1-5-32-544',
      entries: [{ kind: 'allow', sid: 'S-1-5-18' }, { kind: 'deny', sid: '' }, { kind: 'other', sid: '' }],
    });
    expect(native.freed).toContain('descriptor');
    expect(native.freed.filter((pointer) => String(pointer).startsWith('text:'))).toHaveLength(2);
  });

  it('reads an empty access list as no entries', () => {
    native.koffi = fakeKoffi();
    native.acl = [];
    expect(readFileSecurity('C:\\bridge.json').entries).toEqual([]);
  });

  it('refuses with the Windows error code, and still frees the descriptor', () => {
    native.koffi = fakeKoffi();
    native.acl = [];
    native.code = 5;
    native.freed = [];
    expect(() => readFileSecurity('C:\\bridge.json')).toThrow('GetNamedSecurityInfoW failed with code 5');
    expect(native.freed).toContain('descriptor');
    native.code = 0;
  });
});
