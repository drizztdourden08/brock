/* @layer electron-main @kind constants */
const CORE_GRAPHICS = '/System/Library/Frameworks/CoreGraphics.framework/CoreGraphics';
const CORE_FOUNDATION = '/System/Library/Frameworks/CoreFoundation.framework/CoreFoundation';

const CG_SIGNATURES = {
  mainDisplayId: 'uint32_t CGMainDisplayID()',
  copyAllModes: 'void *CGDisplayCopyAllDisplayModes(uint32_t display, void *options)',
  copyCurrentMode: 'void *CGDisplayCopyDisplayMode(uint32_t display)',
  refreshRate: 'double CGDisplayModeGetRefreshRate(void *mode)',
  width: 'size_t CGDisplayModeGetWidth(void *mode)',
  height: 'size_t CGDisplayModeGetHeight(void *mode)',
  setMode: 'int32_t CGDisplaySetDisplayMode(uint32_t display, void *mode, void *options)',
} as const;

const CF_SIGNATURES = {
  count: 'long CFArrayGetCount(void *array)',
  valueAt: 'void *CFArrayGetValueAtIndex(void *array, long index)',
  release: 'void CFRelease(void *ref)',
} as const;

export { CORE_GRAPHICS, CORE_FOUNDATION, CG_SIGNATURES, CF_SIGNATURES };
