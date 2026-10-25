/* @layer renderer-components @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'An image drawn inside an SVG, at a given position and size.',
  useWhen: ['A picture sits inside an svg element beside paths and text, such as a button glyph on a drawing of a pad.'],
  avoidWhen: [{ case: 'A picture on the page, outside an svg.', use: 'Image' }],
  rules: [
    'Pass href, x, y, width and height; it takes the props of the svg image element.',
    'Use it only inside an svg element.',
  ],
  a11y: ['Hide a decorative picture with aria-hidden and give a meaningful one a label.'],
  example: `import { SvgImage } from '@drizztdourden08/brock-input/renderer';

const Glyph = ({ href }: { href: string }) => (
  <svg viewBox="0 0 24 24" width={24} height={24}>
    <SvgImage href={href} x={0} y={0} width={24} height={24} aria-hidden />
  </svg>
);
`,
  buildingBlock: true,
  propsHash: '065450add080ff26',
} satisfies ComponentUsage;

export { usage };
