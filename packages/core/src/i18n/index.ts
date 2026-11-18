/* @layer core @kind barrel */
export { createI18n } from './create-i18n';
export { msg } from './msg';
export { parseMessage } from './parse/parse-message';
export { createCatalog } from './catalog/create-catalog';
export { fallbackChain } from './locale/fallback-chain';
export { negotiateLocale } from './locale/negotiate-locale';
export { textDirection } from './locale/text-direction';
export { isPseudoLocale } from './locale/pseudo/is-pseudo-locale';
export { PSEUDO_ACCENTED, PSEUDO_MIRRORED, PSEUDO_LOCALES } from './locale/pseudo/pseudo.constants';
export type { Message, Text } from './text.type';
export type { MessageKey, ValuesOf, ArgsOf } from './message-key.type';
export type { MessageValue, MessageValues } from './message-values.type';
export type { I18n, I18nOptions, I18nFormat, MissingEvent, Listener, TagMap } from './i18n.type';
export type { Catalog, Layer, LayerKind } from './catalog/catalog.type';
export type { Direction } from './locale/locale.type';
export type { MessageNode, FormatKind, NodeCases } from './parse/node.type';
export type { Messages } from '../augment';
