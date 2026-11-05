/* @layer renderer-shell @kind logic */
import type { LobbyProblem, LobbyRef } from '../../../archipelago/lobby';
import { FORM_ERRORS, NOT_LISTED, UNREACHABLE_CODES, labelledErrorsOf } from './form-error.constants';
import type { FormLabels } from './form-labels.type';

const formErrorOf = (failure: LobbyProblem, server: string, labels: FormLabels, lobby?: LobbyRef): string => {
  if (failure.code === 'lobby-not-found' && lobby?.joinToken !== undefined) return NOT_LISTED;
  if (UNREACHABLE_CODES.includes(failure.code)) return `Could not reach ${server}.`;
  if (failure.code === 'rate-limited') return `Too many tries. Wait ${failure.retryAfter ?? 60} s.`;
  return labelledErrorsOf(labels)[failure.code] ?? FORM_ERRORS[failure.code] ?? failure.message;
};

export { formErrorOf };
