/* @layer renderer-shell @kind constants */
const GESTURE_EVENTS = ['pointerdown', 'touchend', 'keydown', 'click'] as const;
const SCHEDULE_LEAD_S = 0.02;
const MAX_QUEUE_S = 0.25;
const SDL_POLL_MS = 50;
const SDL_POLL_LIMIT = 200;
const PCM16_SCALE = 32768;

export { GESTURE_EVENTS, SCHEDULE_LEAD_S, MAX_QUEUE_S, SDL_POLL_MS, SDL_POLL_LIMIT, PCM16_SCALE };
