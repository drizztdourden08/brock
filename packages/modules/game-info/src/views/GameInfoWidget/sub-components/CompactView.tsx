/* @layer renderer-shell @kind component */
import { Stack } from '@drizztdourden08/tessera/primitives';
import type { SectionViewProps } from '../GameInfoWidget.type';
import { SectionCard } from './SectionCard';

const CompactView = ({ sections, prefs, customHidden }: SectionViewProps) => (
  <Stack className="game-info">
    {sections.map((section) => (
      <SectionCard key={section.id} section={section} prefs={prefs} customHidden={customHidden} />
    ))}
  </Stack>
);

export { CompactView };
