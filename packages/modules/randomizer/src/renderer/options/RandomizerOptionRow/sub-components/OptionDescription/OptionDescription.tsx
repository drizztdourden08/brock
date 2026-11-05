/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import type { OptionDescriptionProps } from './OptionDescription.type';

const OptionDescription = ({ option }: OptionDescriptionProps) => {
  const { details } = option;
  if (details === undefined || details.length === 0) return <Text>{option.description ?? option.hint}</Text>;
  const facts = details.map(({ term, detail }) => ({ label: term, value: detail }));
  return <FactsPanel layout="terms" groups={[facts]} />;
};

export { OptionDescription };
