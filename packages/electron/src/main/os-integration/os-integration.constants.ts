/* @layer electron-main @kind constants */
const CLASSES_KEY = 'HKCU\\Software\\Classes';
const FILE_ICONS_DIR = 'file-icons';
const SHELL_NOTIFY_TIMEOUT_MS = 10_000;
const SHELL_NOTIFY_SCRIPT = [
  '$s=\'[DllImport("shell32.dll")] public static extern void SHChangeNotify(int e,uint f,IntPtr a,IntPtr b);\';',
  '$t=Add-Type -MemberDefinition $s -Name Shell -Namespace Win -PassThru;',
  '$t::SHChangeNotify(0x08000000,0x1000,[IntPtr]::Zero,[IntPtr]::Zero);',
].join('');
const DESKTOP_DIR = ['.local', 'share', 'applications'];
const MIME_DIR = ['.local', 'share', 'mime'];

export { CLASSES_KEY, FILE_ICONS_DIR, SHELL_NOTIFY_TIMEOUT_MS, SHELL_NOTIFY_SCRIPT, DESKTOP_DIR, MIME_DIR };
