/* @layer renderer-components @kind logic */
import { createElement } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { LivePage } from '@drizztdourden08/brock-react';
import { EmptyState, Icon } from '@drizztdourden08/tessera/primitives';
import { NO_PADS_KEY, NO_PADS_MESSAGE, NO_PADS_TITLE } from '../ControllerPage.constants';

const noPadsPage = (text: (value: Text) => string): LivePage => ({
  key: NO_PADS_KEY,
  title: text(NO_PADS_TITLE),
  render: () => createElement(EmptyState, { message: text(NO_PADS_MESSAGE), size: 'hero', icon: createElement(Icon, { name: 'gamepad-2' }) }),
});

export { noPadsPage };
