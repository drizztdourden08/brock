/* @layer renderer-shell @kind logic */
import {
  BREADCRUMB_WEIGHTS, DESCRIPTION_WEIGHTS, KEYWORD_WEIGHTS, KIND_BOOST, LABEL_WEIGHTS,
} from './palette.constants';
import type { FieldWeights, SearchEntry } from './palette.type';

const escapeRegex = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const scoreField = (text: string | undefined, token: string, weights: FieldWeights): number => {
  if (!text) return 0;
  const value = text.toLowerCase();
  if (value === token) return weights.exact;
  if (value.startsWith(token)) return weights.prefix;
  if (new RegExp(`\\b${escapeRegex(token)}`).test(value)) return weights.wordStart;
  return value.includes(token) ? weights.substring : 0;
};

const scoreToken = (entry: SearchEntry, token: string): number => Math.max(
  scoreField(entry.label, token, LABEL_WEIGHTS),
  scoreField(entry.keywords, token, KEYWORD_WEIGHTS),
  scoreField(entry.description, token, DESCRIPTION_WEIGHTS),
  scoreField(entry.breadcrumb.join(' '), token, BREADCRUMB_WEIGHTS),
);

const scoreEntry = (entry: SearchEntry, tokens: readonly string[]): number | null => {
  let total = KIND_BOOST[entry.kind];
  for (const token of tokens) {
    const score = scoreToken(entry, token);
    if (score === 0) return null;
    total += score;
  }
  return total;
};

const rankEntries = (entries: readonly SearchEntry[], query: string): SearchEntry[] => {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter((ranked): ranked is { entry: SearchEntry; score: number } => ranked.score !== null)
    .sort((a, b) => b.score - a.score || a.entry.label.length - b.entry.label.length)
    .map((ranked) => ranked.entry);
};

export { rankEntries };
