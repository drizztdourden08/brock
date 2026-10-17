/* @layer renderer-shell @kind component */
import { useWalker } from './behavior/useWalker';
import { WalkerLayer } from './sub-components/WalkerLayer';
import './WindowMascot.css';

const WindowMascot = () => {
  const walker = useWalker();
  return walker && <WalkerLayer brand={walker.brand} hint={walker.hint} />;
};

export { WindowMascot };
