/* @layer electron-main @kind test */
import { generateKeyPairSync, sign, verify } from 'node:crypto';
import type { KeyObject } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ecDigestOf } from '../src/main/compat/ec-digest-of';
import { ecNullDigestVerify } from '../src/main/compat/ec-null-digest-verify';
import type { CryptoVerify } from '../src/main/compat/ec-null-digest.type';

const data = Buffer.from('signed payload');
const curves = ['prime256v1', 'secp384r1', 'secp521r1'];

const recorder = (): { verify: CryptoVerify; algorithms: unknown[] } => {
  const algorithms: unknown[] = [];
  const recording = (algorithm: unknown): boolean => {
    algorithms.push(algorithm);
    return true;
  };
  return { verify: recording, algorithms };
};

const ecPair = (namedCurve: string): { publicKey: KeyObject; privateKey: KeyObject } =>
  generateKeyPairSync('ec', { namedCurve });

describe('ecDigestOf with KeyObject inputs', () => {
  it.each(curves)('picks the default digest for a bare public %s key', (curve) => {
    expect(ecDigestOf(ecPair(curve).publicKey)).toBe('sha256');
  });

  it.each(curves)('picks the default digest for { key } holding a public %s key', (curve) => {
    expect(ecDigestOf({ key: ecPair(curve).publicKey })).toBe('sha256');
  });

  it('still derives the public key from a private KeyObject', () => {
    const { privateKey } = ecPair('prime256v1');
    expect(ecDigestOf(privateKey)).toBe('sha256');
    expect(ecDigestOf({ key: privateKey })).toBe('sha256');
  });

  it('keeps PEM, DER and JWK inputs working', () => {
    const { publicKey } = ecPair('secp384r1');
    expect(ecDigestOf(publicKey.export({ type: 'spki', format: 'pem' }))).toBe('sha256');
    expect(ecDigestOf({ key: publicKey.export({ type: 'spki', format: 'der' }), format: 'der', type: 'spki' })).toBe('sha256');
    expect(ecDigestOf({ key: publicKey.export({ format: 'jwk' }), format: 'jwk' })).toBe('sha256');
  });

  it('leaves non-EC keys untouched', () => {
    expect(ecDigestOf(generateKeyPairSync('ed25519').publicKey)).toBeNull();
    expect(ecDigestOf({ key: generateKeyPairSync('rsa', { modulusLength: 2048 }).publicKey })).toBeNull();
  });
});

describe('ecNullDigestVerify with KeyObject inputs', () => {
  it.each(curves)('hands the picked digest to the original for a public %s KeyObject', (curve) => {
    const { verify: original, algorithms } = recorder();
    const { publicKey } = ecPair(curve);
    const wrapped = ecNullDigestVerify(original);
    wrapped(null, data, publicKey, Buffer.alloc(8));
    wrapped(null, data, { key: publicKey }, Buffer.alloc(8));
    expect(algorithms).toEqual(['sha256', 'sha256']);
  });

  it('does not pick a digest for a non-EC KeyObject', () => {
    const { verify: original, algorithms } = recorder();
    ecNullDigestVerify(original)(null, data, generateKeyPairSync('ed25519').publicKey, Buffer.alloc(8));
    expect(algorithms).toEqual([null]);
  });

  it('verifies an ECDSA signature through a digest-requiring verify', () => {
    const strict: CryptoVerify = ((algorithm: unknown, ...rest: unknown[]) => {
      if (typeof algorithm !== 'string') throw new Error('no default digest');
      return (verify as (...args: unknown[]) => boolean)(algorithm, ...rest);
    });
    const { publicKey, privateKey } = ecPair('prime256v1');
    const signature = sign('sha256', data, privateKey);
    expect(() => strict(null, data, publicKey, signature)).toThrow('no default digest');
    expect(ecNullDigestVerify(strict)(null, data, publicKey, signature)).toBe(true);
    expect(ecNullDigestVerify(strict)(null, data, { key: publicKey }, signature)).toBe(true);
  });
});
