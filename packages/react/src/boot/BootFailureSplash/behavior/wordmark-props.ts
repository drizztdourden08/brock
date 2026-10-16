/* @layer renderer-shell @kind logic */
import type { CSSProperties } from 'react';
import { SPLASH_CLASS, WORDMARK_CLASS, WORDMARK_PROPERTY } from './wordmark-props.constants';
import type { WordmarkProps } from './wordmark-props.type';

const wordmarkProps = (wordmark: string | undefined): WordmarkProps => {
  if (!wordmark) return { className: SPLASH_CLASS };
  const style = { [WORDMARK_PROPERTY]: `url(${JSON.stringify(wordmark)})` } as CSSProperties;
  return { className: WORDMARK_CLASS, style };
};

export { wordmarkProps };
