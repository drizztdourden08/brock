/* @layer renderer-shell @kind component */
import { Disclosure, SectionHeader, Text } from '@drizztdourden08/tessera/primitives';
import { DROPPED_NOTE } from '../GameInfoWidget.constants';
import { BlockView } from './BlockView';
import type { SectionCardProps } from './SectionCard.type';

const SectionCard = ({ section, prefs, customDropped, collapsible = false }: SectionCardProps) => {
  const body = (
    <div className="game-info-section">
      {section.blocks.map((block, index) => <BlockView key={index} block={block} prefs={prefs} />)}
      {customDropped && section.blocks.length === 0 && <Text tone="faint">{DROPPED_NOTE}</Text>}
    </div>
  );
  if (collapsible) return <Disclosure summary={section.title} defaultOpen>{body}</Disclosure>;
  return (
    <div className="game-info-section">
      <SectionHeader title={section.title} />
      {body}
    </div>
  );
};

export { SectionCard };
