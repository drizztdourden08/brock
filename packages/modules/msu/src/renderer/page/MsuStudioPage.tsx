/* @layer renderer-shell @kind component */
import { MsuStudioProvider } from '../game/MsuStudioProvider';
import { MsuStudioBody } from './MsuStudioBody';
import type { MsuStudioPageProps } from './MsuStudioPage.type';

const MsuStudioPage = (props: MsuStudioPageProps) => {
  const { game, store, ...body } = props;

  return (
    <MsuStudioProvider game={game} store={store}>
      <MsuStudioBody {...body} />
    </MsuStudioProvider>
  );
};

export { MsuStudioPage };
