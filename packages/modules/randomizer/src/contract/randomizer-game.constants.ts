/* @layer core @kind constants */
const REQUIRED_GAME_FIELDS = [
  'id', 'world', 'placementSchemas', 'core', 'roll', 'describe', 'memory', 'applier', 'profile',
] as const;

export { REQUIRED_GAME_FIELDS };
