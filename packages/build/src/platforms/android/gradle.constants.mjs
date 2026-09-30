/* @layer tooling-scripts @kind constants */
const APPLY_PLUGIN = /^apply plugin: 'com\.android\.application'\n/m;
const VERSION_CODE = /versionCode \d+/;
const VERSION_NAME = /versionName "[^"]*"/;
const BUILD_TYPES = /^ {4}buildTypes \{\n/m;
const RELEASE_TYPE = /^ {4}buildTypes \{\n {8}release \{\n/m;

const JSON_IMPORT = 'import groovy.json.JsonSlurper';
const KEYSTORE_LINE = "\ndef releaseKeystore = System.getenv('BROCK_KEYSTORE_FILE') ?: findProperty('BROCK_KEYSTORE_FILE')\n";
const SIGN_RELEASE = '            if (releaseKeystore) signingConfig signingConfigs.release\n';

const SIGNING_MARKER = 'BROCK_KEYSTORE_FILE';
const VERSION_MARKER = 'appVersionCode';

export { APPLY_PLUGIN, VERSION_CODE, VERSION_NAME, BUILD_TYPES, RELEASE_TYPE, JSON_IMPORT, KEYSTORE_LINE, SIGN_RELEASE, SIGNING_MARKER, VERSION_MARKER };
