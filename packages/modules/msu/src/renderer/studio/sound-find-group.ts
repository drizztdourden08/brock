/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { SearchInput } from '@drizztdourden08/tessera/primitives';
import type { ToolGroup } from '@drizztdourden08/tessera/primitives';

const soundFindGroup = (placeholder: string, filter: string, onChange: (filter: string) => void): ToolGroup => ({
  id: 'find',
  label: 'Find',
  content: createElement(SearchInput, {
    grow: false, value: filter, onChange, placeholder, 'aria-label': 'Find a sound',
  }),
});

export { soundFindGroup };
