/* @layer renderer-shell @kind logic */
import type { OptionTab } from '../../../contract/randomizer-views.type';
import type { OptionCatalog } from '../../../world/options/option-catalog.type';
import { GENERAL_TAB_ID, GENERAL_TAB_LABEL } from '../OptionsPanel/OptionsPanel.constants';
import { sectionsOf } from './sections-of';

const defaultOptionTabs = (catalog: OptionCatalog): readonly OptionTab[] =>
  sectionsOf(catalog).map(([section, options]) => ({
    id: section === '' ? GENERAL_TAB_ID : section,
    label: section === '' ? GENERAL_TAB_LABEL : section,
    keys: options.map((option) => option.key),
  }));

export { defaultOptionTabs };
