/* @layer renderer-shell @kind types */
interface SaveFeedback {
  tone: 'ok' | 'error';
  text: string;
}

export type { SaveFeedback };
