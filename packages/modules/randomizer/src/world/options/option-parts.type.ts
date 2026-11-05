/* @layer core @kind types */

type OptionKind = 'choice' | 'range' | 'toggle' | 'text';

type OptionImplementation = 'active' | 'vanilla-fixed' | 'not-implemented' | 'not-applicable';

interface OptionRange {
  min: number;
  max: number;
}

interface OptionDetail {
  term: string;
  detail: string;
}

export type { OptionDetail, OptionImplementation, OptionKind, OptionRange };
