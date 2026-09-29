/* @layer renderer-shell @kind logic */
import type { ReviewStep } from '../review.type';

const labelOf = (face: FontFace): string => `${face.family} ${face.style} ${face.weight}`;

const fontsStep: ReviewStep = {
  name: 'fonts',
  run: async (tour) => {
    await document.fonts.ready;
    const faces = [...document.fonts];
    const failed = faces.filter((face) => face.status === 'error').map(labelOf);
    const loadedFaces = faces.filter((face) => face.status === 'loaded');
    const loaded = loadedFaces.length;
    const families = [...new Set(loadedFaces.map((face) => face.family))].join(', ');
    tour.check(
      'fonts-loaded',
      failed.length === 0 && loaded > 0,
      `${loaded} font faces loaded (${families}), none failed`,
      failed.length > 0 ? `font faces failed: ${failed.join(', ')}` : 'no font face loaded',
    );
  },
};

export { fontsStep };
