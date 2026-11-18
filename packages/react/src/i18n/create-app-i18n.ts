/* @layer renderer-shell @kind logic */
import { createI18n } from '@drizztdourden08/brock-core/i18n';
import type { I18n, Layer } from '@drizztdourden08/brock-core/i18n';
import type { AppLocales } from './i18n.type';
import { DEFAULT_BASE_LOCALE } from './brock-layers.constants';
import { BROCK_REACT_LAYERS } from './brock-react-layers';
import { reportMissing } from './report-missing';

const createAppI18n = (locales: AppLocales | undefined, moduleLayers: readonly Layer[]): I18n =>
  createI18n({
    base: locales?.base ?? DEFAULT_BASE_LOCALE,
    layers: [...BROCK_REACT_LAYERS, ...moduleLayers, ...(locales?.layers ?? [])],
    load: locales?.load,
    onMissing: reportMissing,
    dev: import.meta.env.DEV,
  });

export { createAppI18n };
