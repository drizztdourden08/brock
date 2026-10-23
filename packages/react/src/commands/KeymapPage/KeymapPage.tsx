/* @layer renderer-shell @kind component */
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { Stack } from '@drizztdourden08/tessera/primitives';
import { useCommandGroups } from '../useCommandGroups';
import { keymapSections } from './behavior/keymap-sections';

const KeymapPage = () => {
  const sections = keymapSections(useCommandGroups());
  return (
    <Stack gap="lg" data-brock-keymap="">
      {sections.map((section) => <SettingsSection key={section.id} {...section} />)}
    </Stack>
  );
};

export { KeymapPage };
