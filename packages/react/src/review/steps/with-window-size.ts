/* @layer renderer-shell @kind logic */
import { settle } from '../dom/settle';
import { probe } from '../widgets/probe';

const withWindowSize = async (size: { width: number; height: number },run: () => Promise<void>): Promise<boolean> => {
  const start = (await probe({ kind: 'main' })).bounds;
  if (start === null) return false;
  await probe({ kind: 'main', bounds: { ...start, width: size.width, height: size.height } });
  await settle();
  try {
    await run();
  } finally {
    await probe({ kind: 'main', bounds: start });
    await settle();
  }
  return true;
};

export { withWindowSize };
