/* @layer renderer-app @kind component */
import { defineScreen, useNavigation, useProduct } from '@drizztdourden08/brock-react';
import { Button, ButtonRow, Center, Image, Stack, Text } from '@drizztdourden08/tessera/primitives';
import './HomeScreen.css';

const HomeView = () => {
  const { open } = useNavigation();
  const product = useProduct();
  return (
    <Center className="home" direction="column">
      <Stack className="home__intro">
        <Image className="home__logo" src={product.logos.app} alt="" />
        <Text as="h1" variant="title">{product.name}</Text>
        <Text variant="body">A blank Brock app. Screens go in src/screens and settings in src/settings.constants.ts.</Text>
        <ButtonRow align="center">
          <Button variant="primary" onClick={() => open('settings')}>Settings</Button>
          <Button variant="secondary" onClick={() => open('about')}>About</Button>
        </ButtonRow>
        <Text variant="caption">Esc opens settings. Ctrl+K searches everything.</Text>
      </Stack>
    </Center>
  );
};

const homeScreen = defineScreen({
  id: 'home',
  title: 'Home',
  render: () => <HomeView />,
});

export { homeScreen };
