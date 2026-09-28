/* @layer renderer-shell @kind component */
import { defineScreen } from '@drizztdourden08/brock-react';
import { InputTester } from './InputTester';
import { INPUT_TESTER_SCREEN_ID } from './input-renderer.constants';

const inputTesterScreen = defineScreen({
  id: INPUT_TESTER_SCREEN_ID,
  title: 'Controllers',
  requiresProfile: false,
  render: () => <InputTester />,
});

export { inputTesterScreen };
