/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { buildSchema } from '@drizztdourden08/tessera/data';
import type { SchemaConfig } from '@drizztdourden08/tessera/data';
import {
  DIRECTORY_COLUMN_LABELS, DIRECTORY_FAMILY_OPTIONS, DIRECTORY_GROUP_OPTIONS, DIRECTORY_SOURCE_OPTIONS, SAMPLE_ROW,
} from '../ControllerDirectory.constants';

const optionsOf = (options: readonly { value: string; label: Text }[], text: (value: Text) => string) =>
  options.map((option) => ({ value: option.value, label: text(option.label) }));

const directorySchema = (text: (value: Text) => string) => {
  const labels = DIRECTORY_COLUMN_LABELS;
  const config: SchemaConfig = {
    order: ['name', 'vidPid', 'family', 'source', 'inputs', 'group'],
    labels: {
      name: text(labels.name),
      vidPid: text(labels.vidPid),
      family: text(labels.family),
      source: text(labels.source),
      inputs: text(labels.inputs),
      group: text(labels.group),
    },
    hidden: ['id', 'connectedKey'],
    kinds: { name: 'string', vidPid: 'string', inputs: 'number' },
    options: {
      family: optionsOf(DIRECTORY_FAMILY_OPTIONS, text),
      source: optionsOf(DIRECTORY_SOURCE_OPTIONS, text),
      group: optionsOf(DIRECTORY_GROUP_OPTIONS, text),
    },
  };
  return buildSchema([SAMPLE_ROW], config);
};

export { directorySchema };
