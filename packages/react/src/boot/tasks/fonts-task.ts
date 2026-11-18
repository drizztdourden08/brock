/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { FONT_TOKENS } from '../boot.constants';
import type { RendererBootTask } from '../renderer-boot.type';

const fontsTask: RendererBootTask = {
  id: 'fonts',
  label: msg('brock-app:boot.task.fonts'),
  run: async ({ report }) => {
    const style = getComputedStyle(document.documentElement);
    const stacks = FONT_TOKENS.map((token) => style.getPropertyValue(token).trim()).filter(Boolean);
    const faces = await Promise.all(stacks.map((stack) => document.fonts.load(`1em ${stack}`)));
    await document.fonts.ready;
    report(1, `${faces.flat().length} font faces`);
  },
};

export { fontsTask };
