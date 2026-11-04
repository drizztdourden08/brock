/* @layer electron-main @kind test */
import { join, resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { bridgeDiscoveryFile, bridgeFileFor } from '../src/bridge';
import { bridgeKeyOf } from '../src/main/bridge/bridge-key';
import { bridgeFileName } from '../src/main/bridge/bridge-file-name';

describe('I-131 bridgeFileFor', { tags: ['standard'] }, () => {
  it('gives the plain file with no user data and no instance', () => {
    expect(bridgeFileFor({ app: 'bxel' })).toBe(bridgeDiscoveryFile('bxel'));
  });

  it('gives the file main writes for a --user-data launch', () => {
    const userData = join('some', 'Data Folder');
    const key = bridgeKeyOf(null, resolve(userData));
    expect(bridgeFileFor({ app: 'bxel', userData })).toBe(bridgeDiscoveryFile('bxel', key));
    expect(bridgeFileFor({ app: 'bxel', userData })).toBe(bridgeFileFor({ app: 'bxel', userData: resolve(userData).toUpperCase() }));
    expect(bridgeFileFor({ app: 'bxel', userData })).toContain(bridgeFileName(key));
    expect(bridgeFileFor({ app: 'bxel', userData })).not.toBe(bridgeFileFor({ app: 'bxel' }));
  });

  it('lets a named instance win over the user data', () => {
    expect(bridgeFileFor({ app: 'bxel', instance: 'Two', userData: 'x' })).toBe(bridgeDiscoveryFile('bxel', 'Two'));
  });
});
