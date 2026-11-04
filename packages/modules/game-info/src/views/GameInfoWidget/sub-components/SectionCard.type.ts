/* @layer renderer-shell @kind types */
import type { GameInfoPrefsValue, VisibleSection } from '../GameInfoWidget.type';

interface SectionCardProps {
  section: VisibleSection;
  prefs: GameInfoPrefsValue;
  customDropped: boolean;
  collapsible?: boolean;
}

export type { SectionCardProps };
