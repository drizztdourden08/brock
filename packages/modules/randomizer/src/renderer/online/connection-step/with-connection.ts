/* @layer renderer-shell @kind logic */
import type { ProfileWizardValues } from '@drizztdourden08/brock-react';
import type { RandomizerProfileConfig } from '../../../augment';
import { ONLINE_MODE } from '../online-mode.constants';
import { connectionFields } from './connection-fields';
import { connectionOfValues } from './connection-of-values';

const withConnection = (config: RandomizerProfileConfig, values: ProfileWizardValues): RandomizerProfileConfig =>
  config.mode === ONLINE_MODE ? { ...config, ...connectionFields(connectionOfValues(values)) } : config;

export { withConnection };
