/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Text } from '@drizztdourden08/tessera/primitives';
import { FactsPanel } from '@drizztdourden08/tessera/composites';
import type { OptionDescriptionProps } from './OptionDescription.type';

const OptionDescription = ({ option }: OptionDescriptionProps) => {
  const text = useText();
  const { details } = option;
  if (details === undefined || details.length === 0) {
    const body = option.description ?? option.hint;
    return <Text>{body === undefined ? undefined : text(body)}</Text>;
  }
  const facts = details.map(({ term, detail }) => ({ label: term, value: detail }));
  return <FactsPanel layout="terms" groups={[facts]} />;
};

export { OptionDescription };
