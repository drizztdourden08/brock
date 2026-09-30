/* @layer tooling-scripts @kind constants */
const MOBILE_DEFAULTS = Object.freeze({ syncCommand: ['npx', 'cap', 'sync'], gradleTask: 'assembleDebug' });

const CONVENTION = Object.freeze({
  dir: '.',
  config: 'capacitor.config.json',
  webBuild: ['pnpm', 'exec', 'brock', 'web', 'build'],
  syncCommand: ['pnpm', 'exec', 'cap', 'sync'],
});

const RELEASE_TASK = 'assembleRelease';

const KEY_ALIAS = 'release';
const KEYSTORE_FOLDER = ['.brock', 'keystores'];
const KEYSTORE_VALIDITY_DAYS = '10000';

const SIGNING_ENV = Object.freeze({
  file: 'BROCK_KEYSTORE_FILE',
  password: 'BROCK_KEYSTORE_PASSWORD',
  alias: 'BROCK_KEY_ALIAS',
});

const SECRET_NAMES = Object.freeze({ keystore: 'ANDROID_KEYSTORE_B64', password: 'ANDROID_KEYSTORE_PASSWORD', alias: 'ANDROID_KEY_ALIAS' });

const MOBILE_USAGE = [
  '  brock mobile push                        web build, cap sync, gradle, adb install and start on the online device',
  '  brock mobile build [--release] [--out <file>]',
  '                                           web build, cap sync, gradle assembleDebug; --release signs assembleRelease',
  '                                           with BROCK_KEYSTORE_* or the keystore mobile keystore made',
  '  brock mobile keystore                    make the release keystore with keytool (asks first) and print the',
  '                                           gh secret set lines for the release workflow; runs none of them',
].join('\n');

export { MOBILE_DEFAULTS, CONVENTION, RELEASE_TASK, KEY_ALIAS, KEYSTORE_FOLDER, KEYSTORE_VALIDITY_DAYS, SIGNING_ENV, SECRET_NAMES, MOBILE_USAGE };
