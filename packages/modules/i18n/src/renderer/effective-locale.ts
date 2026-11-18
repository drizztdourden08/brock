/* @layer renderer-shell @kind logic */
import type { LocaleChoiceState } from './locale-choice.type';

const effectiveLocale = ({ app, profile }: Pick<LocaleChoiceState, 'app' | 'profile'>): string | null => profile ?? app?.locale ?? null;

export { effectiveLocale };
