/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { HeaderTabItem } from '@drizztdourden08/tessera/composites';

interface SettingsPageAnchor {
  id: string;
  label: string;
}

interface SettingsPageTabs {
  items: HeaderTabItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

interface SettingsPageProps {
  icon: ReactNode;
  title: string;
  backdrop?: ReactNode;
  anchors?: SettingsPageAnchor[];
  tabs?: SettingsPageTabs;
  scroll?: boolean;
  actions?: ReactNode;
  children: ReactNode;
}

export type { SettingsPageAnchor, SettingsPageProps, SettingsPageTabs };
