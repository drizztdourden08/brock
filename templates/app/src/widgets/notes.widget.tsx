/* @layer renderer-app @kind component */
import { useWidgetPref } from '@drizztdourden08/brock-react';
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { Textarea } from '@drizztdourden08/tessera/primitives';

const meta: WidgetMeta = { label: 'Notes', icon: 'pencil', defaultSide: 'right', defaultDockedSize: 280, popOut: true };

const NotesWidget = () => {
  const [text, setText] = useWidgetPref('notes', 'text', '');
  return <Textarea aria-label="Notes" resize="none" placeholder="Notes kept with this profile" value={text} onChange={(event) => setText(event.target.value)} />;
};

export default NotesWidget;
export { meta };
