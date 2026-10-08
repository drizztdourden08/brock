/* @layer renderer-shell @kind logic */
import type { ComponentType } from 'react';
import * as primitives from '@drizztdourden08/tessera/primitives';
import { MARKDOWN_PART } from '../ReleaseNotesPanel.constants';
import type { MarkdownPartProps } from '../ReleaseNotesPanel.type';

const isComponent = (part: unknown): part is ComponentType<MarkdownPartProps> =>
  typeof part === 'function' || (typeof part === 'object' && part !== null && '$$typeof' in part);

const tesseraMarkdown = (): ComponentType<MarkdownPartProps> | null => {
  const part: unknown = Reflect.get(primitives, MARKDOWN_PART);
  return isComponent(part) ? part : null;
};

export { tesseraMarkdown };
