/* @layer renderer-app @kind config */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { defineTour } from '@drizztdourden08/brock-react';

export default defineTour({
  id: 'welcome',
  title: msg('app:tour.welcome.title'),
  description: msg('app:tour.welcome.description'),
  trigger: 'first-run',
  steps: [
    {
      id: 'menu',
      target: { shell: 'menu' },
      title: msg('app:tour.menu.title'),
      body: 'Every screen, the widgets and this tour are one click away here.',
      mascot: 'wave',
    },
    {
      id: 'search',
      target: { shell: 'search' },
      placement: 'bottom-end',
      title: msg('app:tour.search.title'),
      body: 'Press Ctrl+K to find any page, setting or action by its name.',
    },
    {
      id: 'notes',
      widget: 'notes',
      advanceOn: { click: { selector: '[data-widget-id="notes"] textarea' } },
      placement: 'bottom-end',
      title: msg('app:tour.notes.title'),
      body: 'A widget docked beside the app. Click in it to start writing: it keeps what you type with your profile.',
      mascot: 'idea',
    },
    {
      id: 'settings',
      open: 'settings',
      target: { setting: 'windowMode' },
      title: msg('app:tour.settings.title'),
      body: 'Change how the app looks and behaves. Changes apply at once and are saved with your profile.',
      mascot: 'happy',
    },
  ],
});
