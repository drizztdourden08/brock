/* @layer renderer-components @kind data */
import type { ControllerSilhouetteAnchors } from '../ControllerSilhouette.type';

const CONTROLLER_SILHOUETTE_ANCHORS: ControllerSilhouetteAnchors = {
  offset: {
    'stick.left': { x: 118.5, y: 91, r: 22.5 },
    'stick.right': { x: 242, y: 139, r: 23 },
    'dpad': { x: 158.5, y: 143, r: 25.5 },
    'face': { x: 282, y: 91.5, r: 32 },
    'shoulder.left': { x: 125, y: 40 },
    'shoulder.right': { x: 275.5, y: 40 },
    'trigger.left': { x: 125, y: 14 },
    'trigger.right': { x: 275.5, y: 14 },
    'meta.view': { x: 177, y: 91, r: 7.5 },
    'meta.menu': { x: 223.5, y: 91, r: 7 },
    'meta.guide': { x: 200, y: 59, r: 12 },
    'meta.capture': { x: 200, y: 88, r: 9 },
  },
  symmetric: {
    'stick.left': { x: 143.5, y: 141, r: 30.5 },
    'stick.right': { x: 255, y: 141.5, r: 31 },
    'dpad': { x: 91.5, y: 95.5, r: 28.5 },
    'face': { x: 307.5, y: 95.5, r: 36.5 },
    'shoulder.left': { x: 96, y: 36 },
    'shoulder.right': { x: 303.5, y: 35.5 },
    'trigger.left': { x: 96, y: 14 },
    'trigger.right': { x: 303.5, y: 14 },
    'meta.view': { x: 129, y: 60.5, r: 7 },
    'meta.menu': { x: 270.5, y: 60.5, r: 7 },
    'meta.guide': { x: 199.5, y: 144.5, r: 9 },
  },
  nintendo: {
    'stick.left': { x: 113, y: 93, r: 29.5 },
    'stick.right': { x: 239, y: 138.5, r: 28 },
    'dpad': { x: 153.5, y: 138, r: 23.5 },
    'face': { x: 283, y: 92.5, r: 36 },
    'shoulder.left': { x: 114.5, y: 32 },
    'shoulder.right': { x: 286, y: 32 },
    'trigger.left': { x: 114.5, y: 14 },
    'trigger.right': { x: 286, y: 14 },
    'meta.view': { x: 161.5, y: 67.5, r: 6.5 },
    'meta.menu': { x: 238.5, y: 67.5, r: 6.5 },
    'meta.guide': { x: 219.5, y: 92.5, r: 7.5 },
    'meta.capture': { x: 181, y: 93, r: 7.5 },
  },
  pad: {
    'dpad': { x: 93.5, y: 133, r: 33 },
    'face': { x: 306.5, y: 133, r: 45 },
    'shoulder.left': { x: 95.5, y: 51 },
    'shoulder.right': { x: 307, y: 51 },
    'meta.view': { x: 166.5, y: 145, r: 11.5 },
    'meta.menu': { x: 206.5, y: 145, r: 11.5 },
  },
};

export { CONTROLLER_SILHOUETTE_ANCHORS };
