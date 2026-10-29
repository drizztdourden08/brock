/* @layer electron-main @kind test */
import { createPublicKey, generateKeyPairSync, sign, verify } from 'node:crypto';
import type { KeyObject } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ecNullDigestState } from '../src/main/compat/ec-null-digest-state';
import { ecNullDigestVerify } from '../src/main/compat/ec-null-digest-verify';
import { installEcNullDigest } from '../src/main/compat/install-ec-null-digest';
import type { EcNullDigestTarget } from '../src/main/compat/ec-null-digest.type';

const data = Buffer.from('signed payload');
const shim = ecNullDigestVerify(verify);

const ecPair = (namedCurve: string): { publicKey: KeyObject; privateKey: KeyObject } =>
  generateKeyPairSync('ec', { namedCurve });

afterEach(() => {
  ecNullDigestState.original = null;
});

describe('ecNullDigestVerify', () => {
  it.each(['prime256v1', 'secp384r1', 'secp521r1'])('verifies a %s signature with a null algorithm', (curve) => {
    const { publicKey, privateKey } = ecPair(curve);
    const signature = sign('sha256', data, privateKey);
    expect(shim(null, data, publicKey, signature)).toBe(true);
    expect(shim(undefined, data, publicKey, signature)).toBe(true);
  });

  it('resolves PEM, DER and JWK keys', () => {
    const { publicKey, privateKey } = ecPair('prime256v1');
    const signature = sign('sha256', data, privateKey);
    const pem = publicKey.export({ type: 'spki', format: 'pem' });
    const der = publicKey.export({ type: 'spki', format: 'der' });
    const jwk = publicKey.export({ format: 'jwk' });
    expect(shim(null, data, pem, signature)).toBe(true);
    expect(shim(null, data, { key: der, format: 'der', type: 'spki' }, signature)).toBe(true);
    expect(shim(null, data, { key: jwk, format: 'jwk' }, signature)).toBe(true);
    expect(shim(null, data, { key: publicKey }, signature)).toBe(true);
    expect(shim(null, data, createPublicKey(pem), signature)).toBe(true);
  });

  it('still fails a wrong signature', () => {
    const { publicKey, privateKey } = ecPair('prime256v1');
    const signature = sign('sha256', Buffer.from('another payload'), privateKey);
    expect(shim(null, data, publicKey, signature)).toBe(false);
  });

});

describe('ecNullDigestVerify pass-through', () => {
  it('passes Ed25519 with a null algorithm through unchanged', () => {
    const { publicKey, privateKey } = generateKeyPairSync('ed25519');
    const signature = sign(null, data, privateKey);
    expect(shim(null, data, publicKey, signature)).toBe(true);
    expect(shim(null, data, publicKey, Buffer.alloc(64))).toBe(false);
  });

  it('passes RSA with a null algorithm through unchanged', () => {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const signature = sign('sha256', data, privateKey);
    expect(shim(null, data, publicKey, signature)).toBe(verify(null, data, publicKey, signature));
  });

  it('passes an explicit algorithm through unchanged', () => {
    const { publicKey, privateKey } = ecPair('secp384r1');
    const signature = sign('sha384', data, privateKey);
    expect(shim('sha384', data, publicKey, signature)).toBe(true);
    expect(shim('sha256', data, publicKey, signature)).toBe(false);
  });

  it('leaves an unreadable key to the original function', () => {
    const run = (check: typeof verify): unknown => {
      try {
        return check(null, data, 'not a key', Buffer.alloc(8));
      } catch (error) {
        return error instanceof Error ? error.message : error;
      }
    };
    expect(run(shim)).toEqual(run(verify));
  });

  it('supports the callback form', async () => {
    const { publicKey, privateKey } = ecPair('prime256v1');
    const signature = sign('sha256', data, privateKey);
    const result = await new Promise<boolean | undefined>((resolve, reject) => {
      shim(null, data, publicKey, signature, (error, ok) => {
        if (error) reject(error);
        else resolve(ok);
      });
    });
    expect(result).toBe(true);
  });
});

describe('installEcNullDigest', () => {
  const target = (): EcNullDigestTarget => ({ verify });
  const electron: NodeJS.ProcessVersions = { ...process.versions, electron: '38.0.0' };
  const options = { env: {}, versions: electron, sync: () => undefined };

  it('does nothing outside Electron', () => {
    const t = target();
    expect(installEcNullDigest(t, { ...options, versions: process.versions })).toBe(false);
    expect(t.verify).toBe(verify);
  });

  it('is off with the option or the environment variable', () => {
    const t = target();
    expect(installEcNullDigest(t, { ...options, enabled: false })).toBe(false);
    expect(installEcNullDigest(t, { ...options, env: { BROCK_NO_EC_DIGEST_SHIM: '1' } })).toBe(false);
    expect(t.verify).toBe(verify);
  });

  it('patches once, keeps the original reachable and logs once', () => {
    const t = target();
    const onInstalled = vi.fn();
    expect(installEcNullDigest(t, { ...options, onInstalled })).toBe(true);
    expect(installEcNullDigest(t, { ...options, onInstalled })).toBe(false);
    expect(onInstalled).toHaveBeenCalledTimes(1);
    expect(ecNullDigestState.original).toBe(verify);
    const { publicKey, privateKey } = ecPair('secp384r1');
    expect(t.verify(null, data, publicKey, sign('sha256', data, privateKey))).toBe(true);
  });
});
