/* @layer renderer-shell @kind component */
import { defineScreen } from '@drizztdourden08/brock-react';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { InputTester } from './InputTester';
import { INPUT_TESTER_SCREEN_ID } from './input-renderer.constants';

const inputTesterScreen = defineScreen({
  id: INPUT_TESTER_SCREEN_ID,
  title: 'Controllers',
  icon: <Icon name="gamepad-2" />,
  requiresProfile: false,
  render: () => <InputTester />,
});

export { inputTesterScreen };
