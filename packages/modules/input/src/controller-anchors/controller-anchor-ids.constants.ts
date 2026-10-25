/* @layer renderer-lib @kind constants */
const CONTROLLER_SILHOUETTE_VARIANTS = ['offset', 'symmetric', 'nintendo', 'pad'] as const;

const CONTROLLER_SILHOUETTE_ANCHOR_IDS = [
  'stick.left', 'stick.right', 'dpad', 'face',
  'shoulder.left', 'shoulder.right', 'trigger.left', 'trigger.right',
  'meta.view', 'meta.menu', 'meta.guide', 'meta.capture',
] as const;

export { CONTROLLER_SILHOUETTE_ANCHOR_IDS, CONTROLLER_SILHOUETTE_VARIANTS };
