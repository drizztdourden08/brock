/* @layer renderer-shell @kind test */
import { defineTour } from '../src/tours/define-tour';

const WELCOME = defineTour({
  id: 'welcome',
  title: 'Welcome',
  trigger: 'first-run',
  steps: [
    { id: 'menu', title: 'Menu', body: 'The menu.', target: { shell: 'menu' } },
    { id: 'notes', title: 'Notes', body: 'Click it.', widget: 'notes', advanceOn: { click: { widget: 'notes' } } },
    { id: 'settings', title: 'Settings', body: 'Saved.', open: 'settings', target: { shell: 'screen' } },
  ],
});

const SESSIONS = defineTour({
  id: 'sessions',
  title: 'Sessions',
  steps: [
    { id: 'start', title: 'Start', body: 'Start one.', target: { tour: 'start' }, advanceOn: { event: 'session-started' } },
    { id: 'done', title: 'Done', body: 'Done.' },
  ],
});

export { SESSIONS, WELCOME };
