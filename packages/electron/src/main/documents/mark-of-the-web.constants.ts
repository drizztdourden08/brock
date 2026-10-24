/* @layer electron-main @kind constants */
const MARKED_EXTENSIONS: ReadonlySet<string> = new Set([
  '.exe', '.com', '.scr', '.bat', '.cmd', '.ps1', '.psm1', '.vbs', '.vbe', '.js', '.jse', '.wsf', '.wsh', '.hta', '.msi', '.msp', '.cpl', '.jar', '.chm', '.reg',
  '.docm', '.dotm', '.xlsm', '.xltm', '.xlam', '.pptm', '.potm', '.ppam', '.one',
  '.doc', '.xls', '.ppt', '.xll', '.rtf',
  '.zip', '.7z', '.rar', '.iso', '.img', '.vhd', '.vhdx',
  '.msc', '.appref-ms', '.application', '.appx', '.msix', '.appinstaller', '.pif', '.settingcontent-ms', '.diagcab',
]);

const ZONE_STREAM = ':Zone.Identifier';

const ZONE_CONTENT = '[ZoneTransfer]\r\nZoneId=3\r\n';

export { MARKED_EXTENSIONS, ZONE_CONTENT, ZONE_STREAM };
