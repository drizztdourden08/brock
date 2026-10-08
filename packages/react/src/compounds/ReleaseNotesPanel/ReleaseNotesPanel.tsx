/* @layer renderer-shell @kind component */
import { Box, ScrollArea, Text } from '@drizztdourden08/tessera/primitives';
import { openExternal } from '../../host/open-external';
import { RELEASE_NOTES_TITLE } from './ReleaseNotesPanel.constants';
import type { ReleaseNotesPanelProps } from './ReleaseNotesPanel.type';
import { NotesBody } from './sub-components/NotesBody';
import './ReleaseNotesPanel.css';

const ReleaseNotesPanel = (props: ReleaseNotesPanelProps) => {
  const { title = RELEASE_NOTES_TITLE, children, markdown = false, onOpenLink = openExternal, className = '' } = props;
  const body = typeof children === 'string'
    ? <NotesBody source={children} markdown={markdown} onOpenLink={onOpenLink} />
    : children;

  return (
    <Box as="section" className={`release-notes-panel${className ? ` ${className}` : ''}`}>
      <Text as="h4" className="release-notes-panel__title">{title}</Text>
      <ScrollArea className="release-notes-panel__content">{body}</ScrollArea>
    </Box>
  );
};

export { ReleaseNotesPanel };
