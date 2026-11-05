/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { UNBOUND } from '../../../bindings';
import { BindingListHeader } from './BindingListHeader';
import { VerbRow } from './VerbRow';
import type { VerbGroupsProps } from './VerbGroups.type';
import './VerbGroups.css';

const VerbGroups = ({ groups, verbs, bindings, icons, headers, labels, onRebind }: VerbGroupsProps) => {
  return (
    <Box className="verb-groups">
      <BindingListHeader actionLabel={headers.action} middleLabel={headers.group} bindingLabel={headers.binding} />
      {groups.map((group) => (
        <Box key={group.id} className="verb-groups__group">
          <Box className="verb-groups__group-head">
            <Text className="verb-groups__group-title">{group.title}</Text>
            {group.hint && <Text variant="caption" className="verb-groups__group-hint">{group.hint}</Text>}
          </Box>
          {verbs.filter((verb) => group.verbs.includes(verb.id)).map((verb) => (
            <VerbRow
              key={verb.id}
              verb={verb}
              groupTitle={group.title}
              binding={bindings[verb.id] ?? UNBOUND}
              icon={icons[verb.id]}
              labels={labels}
              onRebind={onRebind}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export { VerbGroups };
