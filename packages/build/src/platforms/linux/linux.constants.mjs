/* @layer tooling-scripts @kind constants */
const DEB_POSTINST_FILE = 'build/linux/deb-postinst.sh';
const APP_HOOK_FILE = 'build/linux/after-install.sh';
const LINUX_DIR = import.meta.dirname;

export { DEB_POSTINST_FILE, APP_HOOK_FILE, LINUX_DIR };
