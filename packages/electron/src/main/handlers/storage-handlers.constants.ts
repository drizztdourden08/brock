/* @layer electron-main @kind constants */
const OS_LABEL: Record<string, string> = {
  win32: 'Windows (AppData)',
  darwin: 'macOS (Application Support)',
  linux: 'Linux (~/.config)',
};

export { OS_LABEL };
