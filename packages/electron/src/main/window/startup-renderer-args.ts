/* @layer electron-main @kind logic */
import type { RendererArgsInput, StartupMarkerInput } from './startup-config.type';

const startupMarkers = ({ config, flags, instance, isDev, argv }: StartupMarkerInput): string[] => {
  const markers: string[] = [];
  if (isDev) markers.push('--startup-dev');
  if (config.fresh) markers.push('--startup-fresh');
  if (argv.includes('--muted')) markers.push('--startup-muted');
  if (argv.includes('--sound')) markers.push('--startup-sound');
  if (instance.name) markers.push(`--startup-instance=${instance.name}`);
  if (instance.profile) markers.push(`--startup-profile=${instance.profile}`);
  if (flags.isAutomationLaunch(argv)) markers.push('--startup-automation');
  return markers;
};

const startupRendererArgs = ({ config, flags, instance, isDev, rendererFlags, argv = process.argv }: RendererArgsInput): string[] => {
  const args = new Set<string>(startupMarkers({ config, flags, instance, isDev, argv }));
  for (const arg of argv) if (arg.startsWith('--startup-')) args.add(arg);
  for (const arg of rendererFlags?.([...argv]) ?? []) args.add(arg);
  return [...args];
};

export { startupRendererArgs };
