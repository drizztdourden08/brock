/* @layer renderer-shell @kind logic */
import type { Layer } from '@drizztdourden08/brock-core/i18n';
import { brockAppLayer } from './brock-app-layer';
import { brockSettingsLayer } from './brock-settings-layer';
import { brockShellLayer } from './brock-shell-layer';

const BROCK_REACT_LAYERS: readonly Layer[] = [brockShellLayer, brockSettingsLayer, brockAppLayer];

export { BROCK_REACT_LAYERS };
