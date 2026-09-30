/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { KEY_ALIAS, KEYSTORE_VALIDITY_DAYS } from './mobile.constants.mjs';

const keytoolOf = () => (process.env.JAVA_HOME ? join(process.env.JAVA_HOME, 'bin', 'keytool') : 'keytool');

/**
 * @param {{ dir: string, keystore: string, password: string, base64: string }} paths
 * @param {string} packageId
 */
const createKeystore = (paths, packageId) => {
  mkdirSync(paths.dir, { recursive: true });
  writeFileSync(paths.password, randomBytes(18).toString('base64url'), { encoding: 'utf8', mode: 0o600 });
  execFileSync(keytoolOf(), [
    '-genkeypair', '-keystore', paths.keystore, '-storetype', 'PKCS12', '-alias', KEY_ALIAS,
    '-keyalg', 'RSA', '-keysize', '2048', '-validity', KEYSTORE_VALIDITY_DAYS,
    '-storepass:file', paths.password, '-keypass:file', paths.password, '-dname', `CN=${packageId}`,
  ], { stdio: 'inherit' });
  writeFileSync(paths.base64, readFileSync(paths.keystore).toString('base64'), { encoding: 'utf8', mode: 0o600 });
};

export { createKeystore };
