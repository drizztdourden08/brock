cmake_minimum_required(VERSION 3.22)
project(brockinput LANGUAGES C CXX)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

if(NOT DEFINED SDL3_SOURCE_DIR)
  message(FATAL_ERROR "SDL3_SOURCE_DIR is not set. The brock-input android/build.gradle passes it.")
endif()
if(NOT EXISTS "${SDL3_SOURCE_DIR}/CMakeLists.txt")
  message(FATAL_ERROR "No SDL3 source at ${SDL3_SOURCE_DIR}. Run node bin/ensure-sdl3-source.mjs in the brock-input package.")
endif()

set(SDL_SHARED OFF CACHE BOOL "" FORCE)
set(SDL_STATIC ON CACHE BOOL "" FORCE)
set(SDL_TEST_LIBRARY OFF CACHE BOOL "" FORCE)
set(SDL_TESTS OFF CACHE BOOL "" FORCE)
set(SDL_EXAMPLES OFF CACHE BOOL "" FORCE)
set(SDL_ANDROID_JAR OFF CACHE BOOL "" FORCE)

add_subdirectory("${SDL3_SOURCE_DIR}" sdl3-build)

add_library(brockinput SHARED
  brock_input_jni.c
  sdl3_gamepad_type.c
  sdl3_json.c
)

target_link_libraries(brockinput PRIVATE SDL3::SDL3-static log android)
set_target_properties(brockinput PROPERTIES LINKER_LANGUAGE CXX)
target_link_options(brockinput PRIVATE "-Wl,-z,max-page-size=16384")
