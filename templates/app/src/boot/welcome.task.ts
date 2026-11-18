/* @layer renderer-app @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { defineBootTask } from '@drizztdourden08/brock-react';

export default defineBootTask({
  label: msg('app:boot.welcome.label'),
  after: ['profiles'],
  run: ({ profile, report }) => {
    report(1, profile ? `Welcome back, ${profile.name}` : 'Welcome');
  },
});
