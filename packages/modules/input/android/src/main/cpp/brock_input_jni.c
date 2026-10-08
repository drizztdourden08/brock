#include <jni.h>
#include <SDL3/SDL.h>
#include <SDL3/SDL_gamepad.h>
#include <stdio.h>
#include <string.h>

#include "sdl3_gamepad_type.h"
#include "sdl3_json.h"

#define MAX_TRACKED_GAMEPADS 8
#define EVENT_BUFFER_CAPACITY (64 * 1024)
#define BRIDGE(name) Java_com_drizztdourden08_brock_input_Sdl3Bridge_##name

typedef struct {
  bool inUse;
  SDL_JoystickID id;
  SDL_Gamepad *gamepad;
  bool dirty;
} TrackedGamepad;

static TrackedGamepad g_gamepads[MAX_TRACKED_GAMEPADS];
static char g_eventBuffer[EVENT_BUFFER_CAPACITY];
static bool g_sdlReady = false;

static TrackedGamepad *FindTracked(SDL_JoystickID id) {
  for (int i = 0; i < MAX_TRACKED_GAMEPADS; ++i) {
    if (g_gamepads[i].inUse && g_gamepads[i].id == id) {
      return &g_gamepads[i];
    }
  }
  return NULL;
}

static TrackedGamepad *AllocateTracked(SDL_JoystickID id) {
  for (int i = 0; i < MAX_TRACKED_GAMEPADS; ++i) {
    if (!g_gamepads[i].inUse) {
      g_gamepads[i].inUse = true;
      g_gamepads[i].id = id;
      g_gamepads[i].dirty = false;
      return &g_gamepads[i];
    }
  }
  return NULL;
}

static const char *ConnectionStateString(SDL_Gamepad *gamepad) {
  switch (SDL_GetJoystickConnectionState(SDL_GetGamepadJoystick(gamepad))) {
    case SDL_JOYSTICK_CONNECTION_WIRED:
      return "wired";
    case SDL_JOYSTICK_CONNECTION_WIRELESS:
      return "wireless";
    default:
      return "unknown";
  }
}

static void WriteCapabilities(Sdl3JsonWriter *writer, SDL_Gamepad *gamepad) {
  bool hasButton[SDL_GAMEPAD_BUTTON_COUNT];
  const char *buttonLabels[SDL_GAMEPAD_BUTTON_COUNT];
  bool hasAxis[SDL_GAMEPAD_AXIS_COUNT];
  for (int i = 0; i < SDL_GAMEPAD_BUTTON_COUNT; ++i) {
    SDL_GamepadButton button = (SDL_GamepadButton)i;
    hasButton[i] = SDL_GamepadHasButton(gamepad, button);
    buttonLabels[i] = Sdl3GamepadButtonLabelString(SDL_GetGamepadButtonLabel(gamepad, button));
  }
  for (int i = 0; i < SDL_GAMEPAD_AXIS_COUNT; ++i) {
    hasAxis[i] = SDL_GamepadHasAxis(gamepad, (SDL_GamepadAxis)i);
  }
  Sdl3JsonRaw(writer, ",\"hasButton\":");
  Sdl3JsonBoolArray(writer, hasButton, SDL_GAMEPAD_BUTTON_COUNT);
  Sdl3JsonRaw(writer, ",\"hasAxis\":");
  Sdl3JsonBoolArray(writer, hasAxis, SDL_GAMEPAD_AXIS_COUNT);
  Sdl3JsonRaw(writer, ",\"buttonLabels\":");
  Sdl3JsonStringArray(writer, buttonLabels, SDL_GAMEPAD_BUTTON_COUNT);
}

static void WriteMapping(Sdl3JsonWriter *writer, SDL_Gamepad *gamepad) {
  char *mapping = SDL_GetGamepadMapping(gamepad);
  if (mapping == NULL) {
    return;
  }
  Sdl3JsonRaw(writer, ",\"mapping\":");
  Sdl3JsonString(writer, mapping);
  SDL_free(mapping);
}

static void WriteAddedEvent(Sdl3JsonWriter *writer, SDL_JoystickID id, SDL_Gamepad *gamepad) {
  char guidBuffer[33] = {0};
  SDL_GUIDToString(SDL_GetGamepadGUIDForID(id), guidBuffer, sizeof(guidBuffer));
  SDL_PropertiesID props = SDL_GetGamepadProperties(gamepad);
  const char *name = SDL_GetGamepadName(gamepad);

  Sdl3JsonRaw(writer, "{\"type\":\"added\",\"id\":");
  Sdl3JsonInt(writer, (int)id);
  Sdl3JsonRaw(writer, ",\"name\":");
  Sdl3JsonString(writer, name != NULL ? name : "");
  Sdl3JsonRaw(writer, ",\"vendorId\":");
  Sdl3JsonInt(writer, SDL_GetGamepadVendor(gamepad));
  Sdl3JsonRaw(writer, ",\"productId\":");
  Sdl3JsonInt(writer, SDL_GetGamepadProduct(gamepad));
  Sdl3JsonRaw(writer, ",\"guid\":");
  Sdl3JsonString(writer, guidBuffer);
  Sdl3JsonRaw(writer, ",\"hasRumble\":");
  Sdl3JsonBool(writer, SDL_GetBooleanProperty(props, SDL_PROP_GAMEPAD_CAP_RUMBLE_BOOLEAN, false));
  Sdl3JsonRaw(writer, ",\"hasGyro\":");
  Sdl3JsonBool(writer, SDL_GamepadHasSensor(gamepad, SDL_SENSOR_GYRO));
  Sdl3JsonRaw(writer, ",\"connectionState\":");
  Sdl3JsonString(writer, ConnectionStateString(gamepad));
  Sdl3JsonRaw(writer, ",\"sdlType\":");
  Sdl3JsonString(writer, Sdl3GamepadTypeString(SDL_GetGamepadType(gamepad)));
  WriteCapabilities(writer, gamepad);
  WriteMapping(writer, gamepad);
  Sdl3JsonRaw(writer, "}");
}

static float NormalizeStick(Sint16 raw) {
  return raw < 0 ? (float)raw / 32768.0f : (float)raw / 32767.0f;
}

static float NormalizeTrigger(Sint16 raw) {
  float value = (float)raw / 32767.0f;
  return value > 0.0f ? value : 0.0f;
}

static void WriteStateEvent(Sdl3JsonWriter *writer, SDL_JoystickID id, SDL_Gamepad *gamepad) {
  bool buttons[SDL_GAMEPAD_BUTTON_COUNT];
  for (int i = 0; i < SDL_GAMEPAD_BUTTON_COUNT; ++i) {
    buttons[i] = SDL_GetGamepadButton(gamepad, (SDL_GamepadButton)i);
  }
  float axes[6];
  axes[0] = NormalizeStick(SDL_GetGamepadAxis(gamepad, SDL_GAMEPAD_AXIS_LEFTX));
  axes[1] = NormalizeStick(SDL_GetGamepadAxis(gamepad, SDL_GAMEPAD_AXIS_LEFTY));
  axes[2] = NormalizeStick(SDL_GetGamepadAxis(gamepad, SDL_GAMEPAD_AXIS_RIGHTX));
  axes[3] = NormalizeStick(SDL_GetGamepadAxis(gamepad, SDL_GAMEPAD_AXIS_RIGHTY));
  axes[4] = NormalizeTrigger(SDL_GetGamepadAxis(gamepad, SDL_GAMEPAD_AXIS_LEFT_TRIGGER));
  axes[5] = NormalizeTrigger(SDL_GetGamepadAxis(gamepad, SDL_GAMEPAD_AXIS_RIGHT_TRIGGER));

  Sdl3JsonRaw(writer, "{\"type\":\"state\",\"id\":");
  Sdl3JsonInt(writer, (int)id);
  Sdl3JsonRaw(writer, ",\"buttons\":");
  Sdl3JsonBoolArray(writer, buttons, SDL_GAMEPAD_BUTTON_COUNT);
  Sdl3JsonRaw(writer, ",\"axes\":");
  Sdl3JsonFloatArray(writer, axes, 6);
  Sdl3JsonRaw(writer, "}");
}

static void Separate(Sdl3JsonWriter *writer, bool *wroteAny) {
  if (*wroteAny) {
    Sdl3JsonRaw(writer, ",");
  }
  *wroteAny = true;
}

static void HandleAdded(Sdl3JsonWriter *writer, SDL_JoystickID id, bool *wroteAny) {
  if (FindTracked(id) != NULL) {
    return;
  }
  SDL_Gamepad *gamepad = SDL_OpenGamepad(id);
  if (gamepad == NULL) {
    return;
  }
  TrackedGamepad *tracked = AllocateTracked(id);
  if (tracked == NULL) {
    SDL_CloseGamepad(gamepad);
    return;
  }
  tracked->gamepad = gamepad;
  Separate(writer, wroteAny);
  WriteAddedEvent(writer, id, gamepad);
}

static void HandleRemoved(Sdl3JsonWriter *writer, SDL_JoystickID id, bool *wroteAny) {
  TrackedGamepad *tracked = FindTracked(id);
  if (tracked == NULL) {
    return;
  }
  SDL_CloseGamepad(tracked->gamepad);
  tracked->inUse = false;
  tracked->gamepad = NULL;
  Separate(writer, wroteAny);
  Sdl3JsonRaw(writer, "{\"type\":\"removed\",\"id\":");
  Sdl3JsonInt(writer, (int)id);
  Sdl3JsonRaw(writer, "}");
}

static void FlushDirty(Sdl3JsonWriter *writer, bool *wroteAny) {
  for (int i = 0; i < MAX_TRACKED_GAMEPADS; ++i) {
    if (!g_gamepads[i].inUse || !g_gamepads[i].dirty) {
      continue;
    }
    g_gamepads[i].dirty = false;
    Separate(writer, wroteAny);
    WriteStateEvent(writer, g_gamepads[i].id, g_gamepads[i].gamepad);
  }
}

static void MarkDirty(SDL_JoystickID id) {
  TrackedGamepad *tracked = FindTracked(id);
  if (tracked != NULL) {
    tracked->dirty = true;
  }
}

JNIEXPORT jboolean JNICALL BRIDGE(nativeStart)(JNIEnv *env, jclass clazz) {
  (void)env;
  (void)clazz;
  if (g_sdlReady) {
    return JNI_TRUE;
  }
  memset(g_gamepads, 0, sizeof(g_gamepads));
  SDL_SetHint(SDL_HINT_JOYSTICK_HIDAPI, "0");
  if (!SDL_Init(SDL_INIT_GAMEPAD)) {
    return JNI_FALSE;
  }
  g_sdlReady = true;
  return JNI_TRUE;
}

JNIEXPORT void JNICALL BRIDGE(nativeStop)(JNIEnv *env, jclass clazz) {
  (void)env;
  (void)clazz;
  if (!g_sdlReady) {
    return;
  }
  for (int i = 0; i < MAX_TRACKED_GAMEPADS; ++i) {
    if (g_gamepads[i].inUse) {
      SDL_CloseGamepad(g_gamepads[i].gamepad);
    }
  }
  memset(g_gamepads, 0, sizeof(g_gamepads));
  SDL_QuitSubSystem(SDL_INIT_GAMEPAD);
  SDL_Quit();
  g_sdlReady = false;
}

JNIEXPORT jstring JNICALL BRIDGE(nativePollEvents)(JNIEnv *env, jclass clazz) {
  (void)clazz;
  if (!g_sdlReady) {
    return (*env)->NewStringUTF(env, "[]");
  }
  Sdl3JsonWriter writer;
  Sdl3JsonInit(&writer, g_eventBuffer, sizeof(g_eventBuffer));
  Sdl3JsonRaw(&writer, "[");
  bool wroteAny = false;
  SDL_Event event;
  while (SDL_PollEvent(&event)) {
    switch (event.type) {
      case SDL_EVENT_GAMEPAD_ADDED:
        HandleAdded(&writer, event.gdevice.which, &wroteAny);
        break;
      case SDL_EVENT_GAMEPAD_REMOVED:
        HandleRemoved(&writer, event.gdevice.which, &wroteAny);
        break;
      case SDL_EVENT_GAMEPAD_AXIS_MOTION:
      case SDL_EVENT_GAMEPAD_BUTTON_DOWN:
      case SDL_EVENT_GAMEPAD_BUTTON_UP:
        MarkDirty(event.gdevice.which);
        break;
      case SDL_EVENT_GAMEPAD_UPDATE_COMPLETE:
        FlushDirty(&writer, &wroteAny);
        break;
      default:
        break;
    }
  }
  Sdl3JsonRaw(&writer, "]");
  return (*env)->NewStringUTF(env, g_eventBuffer);
}

JNIEXPORT jboolean JNICALL BRIDGE(nativeRumble)(JNIEnv *env, jclass clazz, jint id, jfloat low, jfloat high, jint durationMs) {
  (void)env;
  (void)clazz;
  TrackedGamepad *tracked = FindTracked((SDL_JoystickID)id);
  if (tracked == NULL) {
    return JNI_FALSE;
  }
  Uint16 lowValue = (Uint16)(SDL_clamp(low, 0.0f, 1.0f) * 0xFFFF);
  Uint16 highValue = (Uint16)(SDL_clamp(high, 0.0f, 1.0f) * 0xFFFF);
  return SDL_RumbleGamepad(tracked->gamepad, lowValue, highValue, (Uint32)durationMs) ? JNI_TRUE : JNI_FALSE;
}

JNIEXPORT jboolean JNICALL BRIDGE(nativeAddMapping)(JNIEnv *env, jclass clazz, jstring mapping) {
  (void)clazz;
  if (!g_sdlReady || mapping == NULL) {
    return JNI_FALSE;
  }
  const char *line = (*env)->GetStringUTFChars(env, mapping, NULL);
  if (line == NULL) {
    return JNI_FALSE;
  }
  int added = SDL_AddGamepadMapping(line);
  (*env)->ReleaseStringUTFChars(env, mapping, line);
  return added >= 0 ? JNI_TRUE : JNI_FALSE;
}

JNIEXPORT jstring JNICALL BRIDGE(nativeMappingForGuid)(JNIEnv *env, jclass clazz, jstring guid) {
  (void)clazz;
  if (!g_sdlReady || guid == NULL) {
    return NULL;
  }
  const char *text = (*env)->GetStringUTFChars(env, guid, NULL);
  if (text == NULL) {
    return NULL;
  }
  char *mapping = SDL_GetGamepadMappingForGUID(SDL_StringToGUID(text));
  (*env)->ReleaseStringUTFChars(env, guid, text);
  if (mapping == NULL) {
    return NULL;
  }
  jstring result = (*env)->NewStringUTF(env, mapping);
  SDL_free(mapping);
  return result;
}

JNIEXPORT jstring JNICALL BRIDGE(nativeVersion)(JNIEnv *env, jclass clazz) {
  (void)clazz;
  char text[32];
  int version = SDL_GetVersion();
  snprintf(text, sizeof(text), "%d.%d.%d", SDL_VERSIONNUM_MAJOR(version), SDL_VERSIONNUM_MINOR(version), SDL_VERSIONNUM_MICRO(version));
  return (*env)->NewStringUTF(env, text);
}
