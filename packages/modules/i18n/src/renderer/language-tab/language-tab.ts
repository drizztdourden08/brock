/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { LocaleSource, TabDef } from '@drizztdourden08/brock-react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { languageSections } from './language-sections';
import { LANGUAGE_TAB_ID, LANGUAGE_TAB_LABEL } from './language-tab.constants';

const languageTab = (source: LocaleSource): TabDef<object> => ({
  id: LANGUAGE_TAB_ID,
  label: LANGUAGE_TAB_LABEL,
  navIcon: createElement(Icon, { name: 'languages' }),
  group: 'App',
  groupId: 'app',
  sections: () => languageSections(source),
});

export { languageTab };
