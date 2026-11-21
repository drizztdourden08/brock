/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { GENERAL_TAB_LABEL } from '../OptionsPanel/OptionsPanel.constants';

const groupLabelOf = (id: string): Text => {
  if (id === '') return GENERAL_TAB_LABEL;
  const words = id.replace(/[-_]+/g, ' ');
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
};

export { groupLabelOf };
