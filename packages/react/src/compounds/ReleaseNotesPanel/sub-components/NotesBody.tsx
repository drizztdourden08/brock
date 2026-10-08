/* @layer renderer-shell @kind component */
import { Paragraph } from '@drizztdourden08/tessera/primitives';
import { tesseraMarkdown } from '../behavior/tessera-markdown';
import type { NotesBodyProps } from './NotesBody.type';

const NotesBody = (props: NotesBodyProps) => {
  const { source, markdown, onOpenLink } = props;
  const Markdown = markdown ? tesseraMarkdown() : null;
  if (Markdown) return <Markdown source={source} onOpenLink={onOpenLink} className="release-notes-panel__markdown" />;
  return <Paragraph tone="dim" className="release-notes-panel__text">{source}</Paragraph>;
};

export { NotesBody };
