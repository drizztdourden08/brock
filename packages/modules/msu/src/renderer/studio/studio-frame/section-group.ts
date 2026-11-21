/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { ToolGroup } from '@drizztdourden08/tessera/primitives';

const sectionGroup = (tabs: ReactNode, t: I18n['t']): ToolGroup => ({ id: 'section', label: t('msu:tool.section'), content: tabs });

export { sectionGroup };
