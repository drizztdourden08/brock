/* @layer renderer-app @kind component */
import { defineScreen, useNavigation } from '@drizztdourden08/brock-react';
import { Button, ButtonRow, Card, Stack, Text } from '@drizztdourden08/tessera/primitives';
import { product } from '../product';

const HomeView = () => {
  const { open } = useNavigation();
  return (
    <Card>
      <Stack>
        <Text as="h1" variant="title">{product.name}</Text>
        <Text variant="body">
          This is a blank Brock app. Screens go in src/screens, settings in src/settings.constants.ts and
          IPC channels in src/ipc/contract.constants.ts.
        </Text>
        <ButtonRow align="start">
          <Button variant="primary" onClick={() => open('settings')}>Settings</Button>
          <Button variant="secondary" onClick={() => open('about')}>About</Button>
        </ButtonRow>
      </Stack>
    </Card>
  );
};

const homeScreen = defineScreen({
  id: 'home',
  title: 'Home',
  render: () => <HomeView />,
});

export { homeScreen };
