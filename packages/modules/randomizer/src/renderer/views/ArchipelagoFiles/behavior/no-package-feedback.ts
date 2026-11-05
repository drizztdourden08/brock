/* @layer renderer-shell @kind logic */
import type { SaveFeedback } from './save-feedback.type';

const noPackageFeedback = (apVersion: string, supported: readonly string[]): SaveFeedback => ({
  tone: 'error',
  text: `Not saved: this app has no world package for Archipelago ${apVersion}. Supported versions: ${supported.join(', ')}.`,
});

export { noPackageFeedback };
