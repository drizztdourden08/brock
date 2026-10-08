#ifndef BROCK_INPUT_SDL3_JSON_H_
#define BROCK_INPUT_SDL3_JSON_H_

#include <stdbool.h>
#include <stddef.h>

typedef struct {
  char *buf;
  size_t cap;
  size_t len;
} Sdl3JsonWriter;

void Sdl3JsonInit(Sdl3JsonWriter *writer, char *buf, size_t cap);
void Sdl3JsonRaw(Sdl3JsonWriter *writer, const char *text);
void Sdl3JsonString(Sdl3JsonWriter *writer, const char *value);
void Sdl3JsonInt(Sdl3JsonWriter *writer, int value);
void Sdl3JsonFloat(Sdl3JsonWriter *writer, float value);
void Sdl3JsonBool(Sdl3JsonWriter *writer, bool value);
void Sdl3JsonBoolArray(Sdl3JsonWriter *writer, const bool *values, int count);
void Sdl3JsonFloatArray(Sdl3JsonWriter *writer, const float *values, int count);
void Sdl3JsonStringArray(Sdl3JsonWriter *writer, const char *const *values, int count);

#endif  // BROCK_INPUT_SDL3_JSON_H_
