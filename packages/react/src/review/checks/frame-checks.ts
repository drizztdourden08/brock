/* @layer renderer-shell @kind logic */
import type { FrameSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const frameChecks = (id: string, title: string, snapshot: FrameSnapshot): ReviewOutcome[] => {
  const { layers, card, title: shown, closeButton } = snapshot;
  return [
    outcome(`${id}-opens`, layers === 1, `"${id}" opened in one layer`, `${layers} layers are visible after opening "${id}"`),
    outcome(`${id}-frame`, card, `"${id}" sits in the standard card frame`, `"${id}" has no ScreenWindow card`),
    outcome(`${id}-header`, shown === title, `the header reads "${title}"`, `the header reads "${shown ?? '(none)'}", expected "${title}"`),
    outcome(`${id}-close-control`, closeButton, 'the header has a close control', 'the header has no close control'),
  ];
};

export { frameChecks };
