#ifndef BROCK_INPUT_SDL3_GAMEPAD_TYPE_H_
#define BROCK_INPUT_SDL3_GAMEPAD_TYPE_H_

#include <SDL3/SDL_gamepad.h>

const char *Sdl3GamepadTypeString(SDL_GamepadType type);
const char *Sdl3GamepadButtonLabelString(SDL_GamepadButtonLabel label);

#endif  // BROCK_INPUT_SDL3_GAMEPAD_TYPE_H_
