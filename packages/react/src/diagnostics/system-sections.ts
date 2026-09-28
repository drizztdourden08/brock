/* @layer renderer-shell @kind logic */
import type { DisplayDiagnostics, GpuDevice, GpuDiagnostics, SystemDiagnostics } from '@drizztdourden08/brock-core';
import { debugSection } from './debug-section';
import type { DebugSection } from './diagnostics.type';
import { formatUnits } from './format-units';

const { duration, ghz, gib, hex, orDash, yesNo } = formatUnits;

const systemSection = ({ os, versions }: SystemDiagnostics): DebugSection => debugSection('System', [
  `OS: ${orDash(os.version)} (${orDash(os.release)}) ${os.arch}`,
  `Uptime: ${duration(os.uptimeSeconds)}, on battery: ${yesNo(os.onBattery)}`,
  `Locale: ${orDash(os.locale)} (system ${orDash(os.systemLocale)}), time zone: ${orDash(os.timeZone)}`,
  os.preferredLanguages.length > 0 && `Preferred languages: ${os.preferredLanguages.join(', ')}`,
  `Versions: node ${versions.node}, v8 ${versions.v8}, chromium ${versions.chrome}, electron ${versions.electron}`,
]);

const hardwareSection = ({ cpu, memory }: SystemDiagnostics): DebugSection => debugSection('CPU and memory', [
  `CPU: ${cpu.model}, ${cpu.logicalCores} logical cores at ${ghz(cpu.speedMhz)} (${cpu.arch})`,
  `RAM: ${gib(memory.totalBytes)} total, ${gib(memory.freeBytes)} free`,
  memory.swapTotalBytes !== null && `Swap: ${gib(memory.swapTotalBytes)} total, ${gib(memory.swapFreeBytes ?? 0)} free`,
]);

const adapterLine = (device: GpuDevice): string => {
  const name = orDash(device.device ?? device.vendor);
  const driver = device.driverVersion ? ` driver ${device.driverVersion}` : '';
  return `Adapter: ${name} [${hex(device.vendorId)}:${hex(device.deviceId)}]${driver}${device.active ? ' (active)' : ''}`;
};

const disabledFeatures = (features: Record<string, string>): string[] =>
  Object.entries(features)
    .filter(([, status]) => !status.startsWith('enabled'))
    .map(([name, status]) => `${name}=${status}`);

const graphicsSection = (gpu: GpuDiagnostics): DebugSection => {
  const disabled = disabledFeatures(gpu.features);
  return debugSection('Graphics', [
    ...gpu.devices.map(adapterLine),
    `Hardware acceleration: ${yesNo(gpu.hardwareAccelerated)}`,
    (gpu.glVendor ?? gpu.glRenderer) && `GL: ${orDash(gpu.glVendor)} / ${orDash(gpu.glRenderer)}`,
    gpu.glVersion && `GL version: ${gpu.glVersion}`,
    disabled.length > 0 ? `Not accelerated: ${disabled.join(', ')}` : 'All GPU features enabled',
  ]);
};

const displayLines = (display: DisplayDiagnostics, index: number): string[] => [
  `${index + 1}. ${display.label}${display.primary ? ' (primary)' : ''}, ${display.internal ? 'internal' : 'external'}`,
  `   Native ${display.nativeSize.width}x${display.nativeSize.height} at ${display.refreshHz ? `${display.refreshHz} Hz` : 'unreported Hz'}, scale ${display.scaleFactor}x`,
  `   Work area ${display.workArea.width}x${display.workArea.height}, colour ${display.colorDepth}-bit`,
];

const displaysSection = (displays: readonly DisplayDiagnostics[]): DebugSection =>
  debugSection(`Displays (${displays.length})`, displays.flatMap(displayLines));

const systemSections = (system: SystemDiagnostics): DebugSection[] => [
  systemSection(system),
  hardwareSection(system),
  graphicsSection(system.gpu),
  displaysSection(system.displays),
];

export { systemSections };
