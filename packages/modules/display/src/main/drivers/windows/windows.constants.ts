/* @layer electron-main @kind constants */
const ENUM_CURRENT_SETTINGS = 0xFFFFFFFF;
const CDS_FULLSCREEN = 0x00000004;
const DISP_CHANGE_SUCCESSFUL = 0;
const MAX_MODES = 20000;
const DM_PELSWIDTH = 0x00080000;
const DM_PELSHEIGHT = 0x00100000;
const DM_DISPLAYFREQUENCY = 0x00400000;

const ENUM_SIGNATURE = 'int __stdcall EnumDisplaySettingsW(const char16_t *lpszDeviceName, uint32_t iModeNum, _Inout_ DEVMODEW *lpDevMode)';
const CHANGE_SIGNATURE = 'long __stdcall ChangeDisplaySettingsExW(const char16_t *lpszDeviceName, _In_ DEVMODEW *lpDevMode, void *hwnd, uint32_t dwflags, void *lParam)';

const DEVMODEW_SCALARS: [string, string][] = [
  ['dmSpecVersion', 'uint16'], ['dmDriverVersion', 'uint16'], ['dmSize', 'uint16'], ['dmDriverExtra', 'uint16'],
  ['dmFields', 'uint32'], ['dmPositionX', 'int32'], ['dmPositionY', 'int32'], ['dmDisplayOrientation', 'uint32'],
  ['dmDisplayFixedOutput', 'uint32'], ['dmColor', 'int16'], ['dmDuplex', 'int16'], ['dmYResolution', 'int16'],
  ['dmTTOption', 'int16'], ['dmCollate', 'int16'],
];

const DEVMODEW_TAIL: [string, string][] = [
  ['dmLogPixels', 'uint16'], ['dmBitsPerPel', 'uint32'], ['dmPelsWidth', 'uint32'], ['dmPelsHeight', 'uint32'],
  ['dmDisplayFlags', 'uint32'], ['dmDisplayFrequency', 'uint32'], ['dmICMMethod', 'uint32'], ['dmICMIntent', 'uint32'],
  ['dmMediaType', 'uint32'], ['dmDitherType', 'uint32'], ['dmReserved1', 'uint32'], ['dmReserved2', 'uint32'],
  ['dmPanningWidth', 'uint32'], ['dmPanningHeight', 'uint32'],
];

export {
  ENUM_CURRENT_SETTINGS, CDS_FULLSCREEN, DISP_CHANGE_SUCCESSFUL, MAX_MODES, DM_PELSWIDTH, DM_PELSHEIGHT,
  DM_DISPLAYFREQUENCY, ENUM_SIGNATURE, CHANGE_SIGNATURE, DEVMODEW_SCALARS, DEVMODEW_TAIL,
};
