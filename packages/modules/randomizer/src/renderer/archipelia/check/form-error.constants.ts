/* @layer renderer-shell @kind constants */
import type { FormLabels } from './form-labels.type';

const unverifiedText = (shortName: string): string => `This ${shortName} build could not be verified. Update ${shortName}.`;

const FORM_ERRORS: Readonly<Record<string, string>> = {
  'lobby-not-found': 'No lobby with this code.',
  'lobby-closed': 'This lobby has ended.',
  'lobby-locked': 'This lobby has started. New players cannot join.',
  'lobby-full': 'This lobby is full.',
  'refused': 'The host refused this player.',
  'slot-name-taken': 'Another player has this slot name.',
  'seat-unavailable': 'That seat is not available. Pick another or join an open seat.',
};

const labelledErrorsOf = ({ game, shortName }: FormLabels): Readonly<Record<string, string>> => ({
  'game-not-allowed': `This lobby does not accept ${game}.`,
  'trust-failed': unverifiedText(shortName),
  'client-revoked': unverifiedText(shortName),
  'unlisted-not-allowed': unverifiedText(shortName),
});

const NOT_LISTED = 'This lobby is no longer listed.';

const noBuildsIndexText = (shortName: string): string => `${shortName} could not read its list of Archipelago builds. Try again.`;

const UNREACHABLE_CODES: readonly string[] = ['connection-failed', 'connection-lost', 'timeout', 'closed'];

export { FORM_ERRORS, NOT_LISTED, UNREACHABLE_CODES, labelledErrorsOf, noBuildsIndexText };
