/* @layer renderer-shell @kind component */
import { Markdown } from '@drizztdourden08/tessera/composites';
import { Paragraph } from '@drizztdourden08/tessera/primitives';
import type { NotesBodyProps } from './NotesBody.type';

const NotesBody = (props: NotesBodyProps) => {
  const { source, markdown, onOpenLink } = props;
  if (markdown) {
    return (
      <Markdown size="sm" headingOffset={2} hideTitle onLink={onOpenLink} className="release-notes-panel__markdown">
        {source}
      </Markdown>
    );
  }
  return <Paragraph tone="dim" className="release-notes-panel__text">{source}</Paragraph>;
};

export { NotesBody };
