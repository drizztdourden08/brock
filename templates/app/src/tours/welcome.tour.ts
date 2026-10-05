/* @layer renderer-app @kind config */
import { defineTour } from '@drizztdourden08/brock-react';

export default defineTour({
  id: 'welcome',
  title: 'Welcome',
  description: 'A short walk through the menu, the search, the Notes widget and the settings.',
  trigger: 'first-run',
  steps: [
    {
      id: 'menu',
      target: { shell: 'menu' },
      title: 'The menu',
      body: 'Every screen, the widgets and this tour are one click away here.',
      mascot: 'wave',
    },
    {
      id: 'search',
      target: { shell: 'search' },
      placement: 'bottom-end',
      title: 'Search',
      body: 'Press Ctrl+K to find any page, setting or action by its name.',
    },
    {
      id: 'notes',
      widget: 'notes',
      advanceOn: { click: { selector: '[data-widget-id="notes"] textarea' } },
      placement: 'bottom-end',
      title: 'Notes',
      body: 'A widget docked beside the app. Click in it to start writing: it keeps what you type with your profile.',
      mascot: 'idea',
    },
    {
      id: 'settings',
      open: 'settings',
      target: { setting: 'windowMode' },
      title: 'Settings',
      body: 'Change how the app looks and behaves. Changes apply at once and are saved with your profile.',
      mascot: 'happy',
    },
  ],
});
