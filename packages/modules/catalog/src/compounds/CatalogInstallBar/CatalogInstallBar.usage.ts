/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The install action of one catalogue item: Install, or Installed with Update and Uninstall, and while the install job runs its bar, its step and Cancel.',
  useWhen: [
    'The detail of a catalogue item the app can install, such as a preset, a theme or a level.',
    'A row of an installed list that offers the update and the uninstall.',
  ],
  avoidWhen: [
    { case: 'A long job with steps and a log, in its own window.', use: 'JobDialog' },
    { case: 'A plain button that starts something with no install state.', use: 'Button' },
  ],
  rules: [
    'Feed it from useCatalogItem through installBarProps, so the bar follows the install job and the installed record.',
    'Pass hasUpdate only when the catalogue lists a newer version than the installed one.',
    'Leave onUninstall out where the item cannot be removed from that place.',
    'Pass text to name the actions in the app\'s words; every key falls back to the default.',
  ],
  a11y: [
    'The progress bar is live while the download runs and carries the step as its label.',
    'An error is shown as an alert under the actions.',
  ],
  tree: {
    path: ['actions', 'one action', 'installs a catalogue item, with its progress'],
    rule: 'Install, update or remove one catalogue item, with its install progress.',
  },
  example: `import { CatalogInstallBar } from '@drizztdourden08/brock-catalog/renderer';

const InstallSample = ({ onInstall, onUninstall }: { onInstall: () => void; onUninstall: () => void }) => (
  <CatalogInstallBar installed hasUpdate onInstall={onInstall} onUninstall={onUninstall} />
);
`,
  propsHash: '6b078930510a5714',
} satisfies ComponentUsage;

export { usage };
