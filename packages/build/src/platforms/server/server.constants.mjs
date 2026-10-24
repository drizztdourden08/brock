/* @layer tooling-scripts @kind constants */
const SERVER_ENTRY = 'server/main.ts';
const SERVER_OUT = 'dist/server';
const SERVER_FILE = 'main.mjs';
const DIST_SERVER = 'dist/server/main.mjs';
const SERVER_SOURCE = /\.(?:ts|mts|js|mjs)$/;
const SERVER_LABEL = 'brock.config.ts server';
const NATIVE_ADDON = /\.node(?:[?#].*)?$/;
const NATIVE_LOADERS = new Set(['bindings', 'node-gyp-build', 'prebuild-install']);
const SERVER_DIR = import.meta.dirname;
const SERVER_NODE_VERSION = '24.11.0';
const SERVER_NODE_SHA256 = Object.freeze({
  [SERVER_NODE_VERSION]: Object.freeze({
    x64: 'b3c071cdf47aab867c3b2aa287257df12ec5d7c962bf922b32fd33226c4295fd',
    arm64: '4786d00c4d259d3ff0b2328307f764ef3ced65f2d6e9502d433e68d66238509d',
  }),
});
const SERVER_ARCHES = Object.freeze({
  x64: Object.freeze({ node: 'x64', deb: 'amd64', docker: 'amd64' }),
  arm64: Object.freeze({ node: 'arm64', deb: 'arm64', docker: 'arm64' }),
});
const SERVER_DEFAULT_ARCHES = Object.freeze(['x64']);
const SERVER_DOCKERFILE = 'build/server/Dockerfile';
const SERVER_POSTINST = 'build/server/postinst';
const SERVER_PRERM = 'build/server/prerm';
const SERVER_HOOK = 'build/server/after-install.sh';
const NODE_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;
const DEBIAN_PACKAGE_PATTERN = /^[a-z0-9][a-z0-9+.-]+$/;
const IMAGE_PATTERN = /^[a-z0-9][a-z0-9._/:-]*$/;
const MAX_PORT = 65535;
const PRIVILEGED_PORT_LIMIT = 1024;
const ACCOUNT_PATTERN = /^[a-z][a-z0-9-]{0,30}$/;
const RESERVED_ACCOUNT_PREFIXES = Object.freeze(['systemd-']);
const RESERVED_ACCOUNTS = Object.freeze([
  'root', 'daemon', 'bin', 'sys', 'sync', 'games', 'man', 'lp', 'mail', 'news', 'uucp', 'proxy', 'www-data', 'backup', 'list', 'irc',
  'gnats', 'nobody', 'messagebus', 'sshd', 'polkitd', 'ntp', 'postgres', 'mysql', 'redis', 'mongodb', 'docker', 'syslog', 'dnsmasq',
  'lxd', 'kvm', 'wheel', 'systemd-journal', 'avahi', 'colord', 'cups', 'dbus', 'postfix', 'chrony', 'admin', 'adm', 'operator', 'staff', 'users', 'sudo', 'shadow', 'tty', 'disk',
]);
const DEB_EMAIL_PATTERN = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$/;
const DEB_VERSION_PATTERN = /^[0-9][A-Za-z0-9.+~-]*$/;

export {
  SERVER_ENTRY, SERVER_OUT, SERVER_FILE, DIST_SERVER, SERVER_SOURCE, SERVER_LABEL, NATIVE_ADDON, NATIVE_LOADERS,
  SERVER_DIR, SERVER_NODE_VERSION, SERVER_ARCHES, SERVER_DEFAULT_ARCHES, SERVER_DOCKERFILE, SERVER_POSTINST,
  SERVER_PRERM, SERVER_HOOK, NODE_VERSION_PATTERN, DEBIAN_PACKAGE_PATTERN, IMAGE_PATTERN, MAX_PORT, SERVER_NODE_SHA256,
  PRIVILEGED_PORT_LIMIT, ACCOUNT_PATTERN, RESERVED_ACCOUNT_PREFIXES, RESERVED_ACCOUNTS, DEB_EMAIL_PATTERN, DEB_VERSION_PATTERN,
};
