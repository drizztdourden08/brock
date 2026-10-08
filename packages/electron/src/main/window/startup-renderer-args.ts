/* @layer electron-main @kind logic */
import { REVIEW_FLAG } from '@drizztdourden08/brock-core/review';
import { wantsBaselines } from '../review/baselines/wants-baselines';
import type { RendererArgsInput, StartupMarkerInput } from './startup-config.type';

const instanceMarkers = ({ flags, instance, argv }: Pick<StartupMarkerInput, 'flags' | 'instance' | 'argv'>): string[] => [
  ...(instance.name && !wantsBaselines(flags, argv) ? [`--startup-instance=${instance.name}`] : []),
  ...(instance.profile ? [`--startup-profile=${instance.profile}`] : []),
];

const startupMarkers = ({ config, flags, instance, isDev, argv }: StartupMarkerInput): string[] => {
  const markers: string[] = [];
  if (isDev) markers.push('--startup-dev');
  if (config.fresh) markers.push('--startup-fresh');
  if (argv.includes('--muted')) markers.push('--startup-muted');
  if (argv.includes('--sound')) markers.push('--startup-sound');
  markers.push(...instanceMarkers({ flags, instance, argv }));
  if (flags.isAutomationLaunch(argv)) markers.push('--startup-automation');
  if (flags.hasFlag(REVIEW_FLAG, argv)) markers.push('--startup-review');
  return markers;
};

const startupRendererArgs = ({ config, flags, instance, isDev, rendererFlags, argv = process.argv }: RendererArgsInput): string[] => {
  const args = new Set<string>(startupMarkers({ config, flags, instance, isDev, argv }));
  for (const arg of argv) if (arg.startsWith('--startup-')) args.add(arg);
  for (const arg of rendererFlags?.([...argv]) ?? []) args.add(arg);
  return [...args];
};

export { startupRendererArgs };
