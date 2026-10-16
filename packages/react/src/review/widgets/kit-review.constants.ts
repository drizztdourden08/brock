/* @layer renderer-shell @kind constants */
const REVIEW_KIT_ID = 'review-kit';
const REVIEW_KIT_CONTEXT = 'review-kit-scene';
const REVIEW_KIT_REASON = 'Start the review scene to open the review kit.';
const REVIEW_KIT_MEMBERS = ['review-kit-left', 'review-kit-right'] as const;
const REVIEW_KIT_OVERLAY = 'review-kit-overlay';
const KIT_NORMAL_WIDGET = 'logs';

const kitSelectors = {
  widget: (id: string): string => `[data-widget-id="${CSS.escape(id)}"]`,
  overlay: (id: string): string => `[data-kit-overlay="${CSS.escape(id)}"]`,
  bar: (kit: string): string => `[data-kit-bar="${CSS.escape(kit)}"]`,
  close: (kit: string): string => `[data-kit-close="${CSS.escape(kit)}"]`,
  waiting: (kit: string): string => `[data-kit-waiting="${CSS.escape(kit)}"]`,
} as const;

export { KIT_NORMAL_WIDGET, REVIEW_KIT_CONTEXT, REVIEW_KIT_ID, REVIEW_KIT_MEMBERS, REVIEW_KIT_OVERLAY, REVIEW_KIT_REASON, kitSelectors };
