/* @layer renderer-shell @kind constants */
const FREE_GAP = 200;
const SNAP_NEAR = 6;
const EDGE_DROP = 40;
const GROW = 120;
const MOVE = { x: 40, y: 30 } as const;
const LOST_AT = -20000;
const COVER_INSET = 20;
const COVER_SIZE = 300;
const COVER_POINT = 60;
const EDGE_POINT_INSET = 10;
const GATE_QUIET_MS = 800;
const COVER_WIDGET_ID = 'review-cover';
const DEV_WIDGET_ID = 'review-dev-only';
const MAIN_LINK = 'main';
const DEV_SETTING = 'developerToolsEnabled';

export {
  COVER_INSET, COVER_POINT, COVER_SIZE, COVER_WIDGET_ID, DEV_SETTING, DEV_WIDGET_ID, EDGE_DROP, EDGE_POINT_INSET, FREE_GAP, GATE_QUIET_MS, GROW, LOST_AT, MAIN_LINK, MOVE,
  SNAP_NEAR,
};
