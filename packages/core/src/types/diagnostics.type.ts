/* @layer core @kind types */
interface DiagnosticsRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DisplayDiagnostics {
  id: number;
  label: string;
  primary: boolean;
  internal: boolean;
  bounds: DiagnosticsRect;
  nativeSize: { width: number; height: number };
  workArea: DiagnosticsRect;
  scaleFactor: number;
  rotation: number;
  refreshHz: number | null;
  colorDepth: number;
  depthPerComponent: number;
  colorSpace: string;
  monochrome: boolean;
  touchSupport: string;
}

interface CpuDiagnostics {
  model: string;
  logicalCores: number;
  speedMhz: number;
  arch: string;
}

interface MemoryDiagnostics {
  totalBytes: number;
  freeBytes: number;
  swapTotalBytes: number | null;
  swapFreeBytes: number | null;
}

interface GpuDevice {
  vendorId: number;
  deviceId: number;
  vendor: string | null;
  device: string | null;
  driverVersion: string | null;
  active: boolean;
}

interface GpuDiagnostics {
  devices: GpuDevice[];
  glVendor: string | null;
  glRenderer: string | null;
  glVersion: string | null;
  driverVersion: string | null;
  hardwareAccelerated: boolean;
  features: Record<string, string>;
}

interface OsDiagnostics {
  platform: string;
  version: string;
  release: string;
  arch: string;
  uptimeSeconds: number;
  locale: string;
  systemLocale: string;
  preferredLanguages: string[];
  timeZone: string;
  onBattery: boolean;
}

interface RuntimeVersions {
  node: string;
  v8: string;
  chrome: string;
  electron: string;
}

interface SystemDiagnostics {
  os: OsDiagnostics;
  cpu: CpuDiagnostics;
  memory: MemoryDiagnostics;
  gpu: GpuDiagnostics;
  displays: DisplayDiagnostics[];
  versions: RuntimeVersions;
}

interface ProcessMetric {
  pid: number;
  type: string;
  name: string | null;
  cpuPercent: number;
  workingSetBytes: number;
  privateBytes: number | null;
}

interface MainProcessMemory {
  rssBytes: number;
  heapUsedBytes: number;
  heapTotalBytes: number;
  externalBytes: number;
}

interface WidgetWindowSummary {
  id: string;
  visible: boolean;
  sync: boolean;
  group: string | null;
}

interface ProcessDiagnostics {
  processes: ProcessMetric[];
  main: MainProcessMemory;
  uptimeSeconds: number;
  windowCount: number;
  widgetWindows: WidgetWindowSummary[];
  ipcCalls: number;
  versions: RuntimeVersions;
  gpuFeatures: Record<string, string>;
}

export type {
  DiagnosticsRect, MainProcessMemory, ProcessDiagnostics, ProcessMetric, DisplayDiagnostics, CpuDiagnostics, MemoryDiagnostics, GpuDevice,
  GpuDiagnostics, OsDiagnostics, RuntimeVersions, SystemDiagnostics, WidgetWindowSummary,
};
