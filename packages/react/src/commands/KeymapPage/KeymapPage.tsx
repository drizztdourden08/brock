/* @layer renderer-shell @kind component */
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Stack } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '../../i18n';
import { useCommandGroups } from '../useCommandGroups';
import { keymapSections } from './behavior/keymap-sections';

const KeymapPage = () => {
  const sections = keymapSections(useCommandGroups(), useT(), useText());
  return (
    <Stack gap="lg" data-brock-keymap="">
      {sections.map((section) => <SettingsSection key={section.id} {...section} />)}
    </Stack>
  );
};

export { KeymapPage };
