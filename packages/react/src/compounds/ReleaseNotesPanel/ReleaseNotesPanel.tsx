/* @layer renderer-shell @kind component */
import { Box, Paragraph, ScrollArea, Text } from '@drizztdourden08/tessera/primitives';
import { RELEASE_NOTES_TITLE } from './ReleaseNotesPanel.constants';
import type { ReleaseNotesPanelProps } from './ReleaseNotesPanel.type';
import './ReleaseNotesPanel.css';

const ReleaseNotesPanel = (props: ReleaseNotesPanelProps) => {
  const { title = RELEASE_NOTES_TITLE, children, className = '' } = props;
  const body = typeof children === 'string'
    ? <Paragraph tone="dim" className="release-notes-panel__text">{children}</Paragraph>
    : children;

  return (
    <Box as="section" className={`release-notes-panel${className ? ` ${className}` : ''}`}>
      <Text as="h4" className="release-notes-panel__title">{title}</Text>
      <ScrollArea className="release-notes-panel__content">{body}</ScrollArea>
    </Box>
  );
};

export { ReleaseNotesPanel };
