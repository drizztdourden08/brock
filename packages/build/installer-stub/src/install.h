// @layer installer @kind types
#pragma once

#include <windows.h>

#include <string>
#include <vector>

#include "paint.h"

namespace install {

std::wstring DefaultPath(ui::Mode mode);
std::wstring FreeSpaceLine(const std::wstring& path);
std::wstring TempFile(const wchar_t* suffix);

bool BrowseForFolder(HWND owner, std::wstring* path);

bool RunSetup(const std::wstring& exe, const std::vector<std::wstring>& args, bool elevated);
bool Handoff(const std::wstring& exe);
// Writes the embedded licence to a temporary text file and opens it in the
// default viewer, for reading it in full.
void OpenLicence();
bool Unpack(const std::wstring& archive, const std::wstring& directory);

/**
 * Starts the installed app. `--silent` suppresses the setup's own launch, so this is
 * what the user sees at the end. Always started unelevated, even after an elevated
 * install, so the app does not run with an administrator token for the whole session.
 */
void LaunchInstalled(const std::wstring& directory);

// A portable copy runs no Velopack install hook, so the stub asks the app to
// write its link and file type keys itself, and waits for it.
void RegisterOsIntegration(const std::wstring& directory);

/** Where an install of this mode ends up, for launching it afterwards. */
std::wstring InstalledRoot(ui::Mode mode, const std::wstring& chosen);

}  // namespace install
