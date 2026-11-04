/* @layer renderer-shell @kind component */
import type { SectionViewProps } from './GameInfoWidget.type';
import { SectionCard } from './sub-components/SectionCard';

const FullView = ({ sections, prefs, customHidden }: SectionViewProps) => (
  <div className="game-info">
    {sections.map((section) => (
      <SectionCard key={section.id} section={section} prefs={prefs} customHidden={customHidden} collapsible />
    ))}
  </div>
);

export { FullView };
