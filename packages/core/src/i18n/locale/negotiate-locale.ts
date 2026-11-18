/* @layer core @kind logic */
import { fallbackChain } from './fallback-chain';
import { languageOf } from './language-of';

const matchTag = (requested: string, available: readonly string[]): string | undefined => {
  const wanted = fallbackChain(requested).map((tag) => tag.toLowerCase());
  for (const tag of wanted) {
    const exact = available.find((candidate) => candidate.toLowerCase() === tag);
    if (exact) return exact;
  }
  const language = languageOf(requested);
  return available.find((candidate) => languageOf(candidate) === language);
};

const negotiateLocale = (requested: readonly string[], available: readonly string[], fallback: string): string => {
  for (const tag of requested) {
    const hit = matchTag(tag, available);
    if (hit) return hit;
  }
  return fallback;
};

export { negotiateLocale };
