/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { isInstanceLaunch } from '../../host/is-instance-launch';
import type { RendererBootTask } from '../renderer-boot.type';

const decode = async (src: string): Promise<void> => {
  const image = new Image();
  image.src = src;
  try {
    await image.decode();
  } catch {
    throw new Error(`the image ${src} did not load or decode`);
  }
};

const imagesTask: RendererBootTask = {
  id: 'images',
  label: msg('brock-app:boot.task.images'),
  run: async ({ product, report }) => {
    const { wordmark } = product.icons;
    const wordmarks = wordmark ? [...new Set([wordmark.src, wordmark.dark])] : [];
    const sources = [product.logos.app, ...(isInstanceLaunch() ? [product.logos.instance] : []), ...wordmarks];
    await Promise.all(sources.map(decode));
    report(1, sources.join(', '));
  },
};

export { imagesTask };
