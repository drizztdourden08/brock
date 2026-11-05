/* @layer renderer-shell @kind logic */
import type { OptionTab } from '../../../contract/randomizer-views.type';
import type { OptionCatalog } from '../../../world/options/option-catalog.type';
import {
  GENERAL_TAB_ID, GENERAL_TAB_LABEL, UPCOMING_TAB_ID, UPCOMING_TAB_LABEL,
} from '../OptionsPanel/OptionsPanel.constants';
import { isUpcoming } from './is-upcoming';
import { sectionsOf } from './sections-of';

const defaultOptionTabs = (catalog: OptionCatalog): readonly OptionTab[] => {
  const upcoming = catalog.filter(isUpcoming).map((option) => option.key);
  const sections = sectionsOf(catalog.filter((option) => !isUpcoming(option))).map(([section, options]) => ({
    id: section === '' ? GENERAL_TAB_ID : section,
    label: section === '' ? GENERAL_TAB_LABEL : section,
    keys: options.map((option) => option.key),
  }));
  return upcoming.length === 0 ? sections : [...sections, { id: UPCOMING_TAB_ID, label: UPCOMING_TAB_LABEL, keys: upcoming }];
};

export { defaultOptionTabs };
