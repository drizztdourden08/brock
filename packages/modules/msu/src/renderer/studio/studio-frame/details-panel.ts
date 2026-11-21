/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { DETAILS_PANEL } from './studio-frame.constants';

const detailsPanel = (text: (value: Text) => string, content: ReactNode) => ({
  ...DETAILS_PANEL,
  title: text(DETAILS_PANEL.title),
  content,
});

export { detailsPanel };
