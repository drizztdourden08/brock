/* @layer core @kind test */
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createNodeSecretStore, envSecretName, NODE_SECRETS_FILE } from '../src/node';

const isPosix = process.platform !== 'win32';
let dataDir = '';

const importsOf = (source: string): string[] => Array.from(source.matchAll(/from '([^']+)'/g), (m) => m[1] ?? '');

beforeEach(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'brock-secrets-'));
});

afterEach(async () => {
  await rm(dataDir, { recursive: true, force: true });
});

describe('node secret store', () => {
  it('round trips a value, a label and the list', async () => {
    const store = createNodeSecretStore({ dataDir, env: {} });
    expect(await store.get('api-token')).toBeNull();
    expect(await store.has('api-token')).toBe(false);
    await store.set('api-token', 'one', 'Account');
    await store.set('other', 'two');
    expect(await store.get('api-token')).toBe('one');
    expect(await store.has('api-token')).toBe(true);
    expect((await store.list()).map((m) => [m.name, m.label])).toEqual([['api-token', 'Account'], ['other', undefined]]);
    await store.set('api-token', 'three');
    expect(await store.get('api-token')).toBe('three');
    expect((await store.list())[0]?.label).toBe('Account');
    await store.delete('api-token');
    expect(await store.get('api-token')).toBeNull();
    expect((await store.list()).map((m) => m.name)).toEqual(['other']);
  });

  it('reads back through a second store on the same folder and leaves no temporary file', async () => {
    await createNodeSecretStore({ dataDir, env: {} }).set('api-token', 'kept');
    expect(await createNodeSecretStore({ dataDir, env: {} }).get('api-token')).toBe('kept');
    expect(await readdir(join(dataDir, 'secrets'))).toEqual(['secrets.json']);
  });

  it('refuses an unsafe name', async () => {
    const store = createNodeSecretStore({ dataDir, env: {} });
    await expect(store.set('../escape', 'x')).rejects.toThrow('Unsafe secret name');
    await expect(store.get('../escape')).rejects.toThrow('Unsafe secret name');
  });

  it('lets an environment variable override the file, and ignores an empty one', async () => {
    const env: Record<string, string | undefined> = { BROCK_SECRET_API_TOKEN: 'from-env' };
    const store = createNodeSecretStore({ dataDir, env });
    await store.set('api-token', 'from-file');
    expect(await store.get('api-token')).toBe('from-env');
    expect(await store.has('env-only')).toBe(false);
    env.BROCK_SECRET_ENV_ONLY = 'x';
    expect(await store.has('env-only')).toBe(true);
    env.BROCK_SECRET_API_TOKEN = '';
    expect(await store.get('api-token')).toBe('from-file');
  });

  it('names the variable in upper snake case', () => {
    expect(envSecretName('api-token')).toBe('BROCK_SECRET_API_TOKEN');
    expect(envSecretName('lobby.admin key')).toBe('BROCK_SECRET_LOBBY_ADMIN_KEY');
    expect(envSecretName('a', 'APP_')).toBe('APP_A');
  });

  it.skipIf(!isPosix)('writes the file with mode 0600 and the folder with mode 0700', async () => {
    await createNodeSecretStore({ dataDir, env: {} }).set('api-token', 'x');
    expect((await stat(join(dataDir, NODE_SECRETS_FILE))).mode & 0o777).toBe(0o600);
    expect((await stat(join(dataDir, 'secrets'))).mode & 0o777).toBe(0o700);
  });

  it('keeps the file plain JSON and says so in the type', async () => {
    const store = createNodeSecretStore({ dataDir, env: {} });
    expect(store.encryptedAtRest).toBe(false);
    await store.set('api-token', 'x');
    const saved = JSON.parse(await readFile(join(dataDir, NODE_SECRETS_FILE), 'utf8')) as Record<string, { value: string }>;
    expect(saved['api-token']?.value).toBe('x');
    const type = await readFile(new URL('../src/node/node-secret-store.type.ts', import.meta.url), 'utf8');
    expect(type).toContain('encryptedAtRest: false');
  });
});

describe('node entry', () => {
  it('never imports electron or the main side', async () => {
    const dir = new URL('../src/node/', import.meta.url);
    const names = (await readdir(dir)).filter((n) => n.endsWith('.ts'));
    const sources = await Promise.all(names.map((n) => readFile(new URL(n, dir), 'utf8')));
    const specifiers = sources.flatMap(importsOf);
    expect(specifiers.length).toBeGreaterThan(0);
    expect(specifiers.filter((s) => /electron|\/main|\/preload|\/renderer/.test(s))).toEqual([]);
  });

  it('is exported as ./node', async () => {
    const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8')) as { exports: Record<string, string> };
    expect(pkg.exports['./node']).toBe('./src/node/index.ts');
  });
});
