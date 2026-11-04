/* @layer renderer-shell @kind logic */
import type { ParsedCommandArgs } from './parse-command-args.type';

const parseCommandArgs = (text: string | undefined): ParsedCommandArgs => {
  if (text === undefined || text.trim() === '') return { value: undefined };
  try {
    return { value: JSON.parse(text) as unknown };
  } catch {
    return { problem: 'args must be a JSON object written as text.' };
  }
};

export { parseCommandArgs };
