/* @layer renderer-shell @kind component */
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { useWalker } from './behavior/useWalker';
import { WalkerLayer } from './sub-components/WalkerLayer';
import './WindowMascot.css';

const WindowMascot = () => {
  const active = useNavigationStore((state) => state.active);
  const walker = useWalker();
  return active !== null && walker ? <WalkerLayer brand={walker.brand} hint={walker.hint} /> : null;
};

export { WindowMascot };
