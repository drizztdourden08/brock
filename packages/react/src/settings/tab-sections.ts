/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { fallbackText } from '../i18n/fallback-text';
import { resolveSectionText } from './resolve-section-text';
import type { Section, TabDef } from './settings.type';
import { tabSectionDefs } from './tab-section-defs';

const tabSections = <S extends object>(tab: TabDef<S>, settings: S, text: (value: Text) => string = fallbackText): Section[] =>
  resolveSectionText(tabSectionDefs(tab, settings), text);

export { tabSections };
