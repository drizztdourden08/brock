/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { satisfiesRange } from '../src/freshness/satisfies-range.mjs';
import { tesseraMismatch } from '../src/freshness/tessera-mismatch.mjs';
import { tesseraCheck } from '../src/platforms/doctor/tessera-check.mjs';
import { appDirs } from './app-dir-harness.mjs';

const { appDir, cleanUp } = appDirs('brock-tessera-');

afterEach(cleanUp);

const installed = (react, tessera, peer = '>=0.78.0 <1') => ({
  'node_modules/@drizztdourden08/brock-react/package.json': JSON.stringify({ version: react, peerDependencies: { '@drizztdourden08/tessera': peer } }),
  ...(tessera ? { 'node_modules/@drizztdourden08/tessera/package.json': JSON.stringify({ version: tessera }) } : {}),
});

describe('satisfiesRange', () => {
  it('reads the ranges Brock packages declare', () => {
    expect(satisfiesRange('0.78.0', '>=0.78.0 <1')).toBe(true);
    expect(satisfiesRange('0.65.2', '>=0.78.0 <1')).toBe(false);
    expect(satisfiesRange('1.0.0', '>=0.78.0 <1')).toBe(false);
    expect(satisfiesRange('0.79.1', '^0.78.0')).toBe(false);
    expect(satisfiesRange('0.78.4', '^0.78.0')).toBe(true);
    expect(satisfiesRange('5.1.0', '^5.0.0 || ^6.0.0')).toBe(true);
    expect(satisfiesRange('0.78.3', '~0.78.1')).toBe(true);
  });

  it('never blocks on a range it cannot read', () => {
    expect(satisfiesRange('0.65.0', 'latest')).toBe(true);
    expect(satisfiesRange('weird', '>=1.0.0')).toBe(true);
  });
});

describe('tesseraMismatch', () => {
  it('says what brock-react needs, what the app has and the command that fixes it', () => {
    const mismatch = tesseraMismatch(appDir(installed('0.108.0', '0.65.0')));
    expect(mismatch?.line).toBe('brock-react 0.108.0 needs Tessera >=0.78.0 <1, this app has 0.65.0. Run pnpm up "@drizztdourden08/tessera@>=0.78.0 <1".');
  });

  it('is quiet when the versions agree, when a package is missing, or when there is no peer range', () => {
    expect(tesseraMismatch(appDir(installed('0.108.0', '0.78.0')))).toBeNull();
    expect(tesseraMismatch(appDir(installed('0.108.0', null)))).toBeNull();
    expect(tesseraMismatch(appDir({}))).toBeNull();
    expect(tesseraMismatch(appDir({ 'node_modules/@drizztdourden08/brock-react/package.json': '{"version":"1.0.0"}', 'node_modules/@drizztdourden08/tessera/package.json': '{"version":"0.1.0"}' }))).toBeNull();
  });

  it('shows up in brock doctor as a missing check with the fix', () => {
    const bad = tesseraCheck().run({ rootDir: appDir(installed('0.108.0', '0.65.0')) });
    expect(bad).toMatchObject({ status: 'missing', install: 'pnpm up "@drizztdourden08/tessera@>=0.78.0 <1"' });
    expect(tesseraCheck().run({ rootDir: appDir(installed('0.108.0', '0.80.0')) }).status).toBe('ok');
  });
});
