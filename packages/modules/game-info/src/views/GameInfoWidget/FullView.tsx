/* @layer renderer-shell @kind component */
import type { SectionViewProps } from './GameInfoWidget.type';
import { SectionCard } from './sub-components/SectionCard';

const FullView = ({ sections, prefs, customDropped }: SectionViewProps) => (
  <div className="game-info">
    {sections.map((section) => (
      <SectionCard key={section.id} section={section} prefs={prefs} customDropped={customDropped} collapsible />
    ))}
  </div>
);

export { FullView };
