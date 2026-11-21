/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import { SearchInput } from '@drizztdourden08/tessera/primitives';
import type { ToolGroup } from '@drizztdourden08/tessera/primitives';

const soundFindGroup = (placeholder: string, filter: string, onChange: (filter: string) => void, t: I18n['t']): ToolGroup => ({
  id: 'find',
  label: t('msu:tool.find'),
  content: createElement(SearchInput, {
    grow: false, value: filter, onChange, placeholder, 'aria-label': t('msu:tool.findSound'),
  }),
});

export { soundFindGroup };
