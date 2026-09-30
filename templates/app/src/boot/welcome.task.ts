/* @layer renderer-app @kind logic */
import { defineBootTask } from '@drizztdourden08/brock-react';

export default defineBootTask({
  label: 'Saying hello',
  after: ['profiles'],
  run: ({ profile, report }) => {
    report(1, profile ? `Welcome back, ${profile.name}` : 'Welcome');
  },
});
