// @layer installer @kind constants
#pragma once

#include <windows.h>

// Written by brock package from the product config and the look: names, the
// pack id, the manifest address, the colours, the gradient, the install choices
// and the stub generation.
#include "product.h"

namespace theme {

// Every rect below is expressed in logical pixels against this canvas. The
// window is created at this size times the monitor scale, and the painter
// applies the same factor as a transform, so one set of numbers serves both
// the live window and the offscreen PNG render at any scale.
constexpr int kWidth = 480;
constexpr int kHeight = 360;

// The manifest carries the stub generation it expects. A build older than that
// number cannot be trusted to understand the rest of the document, so it steps
// aside for a fresh download instead of guessing.
constexpr int kStubVersion = BROCK_STUB_VERSION;

// Stored as plain DWORDs so this header stays free of the graphics headers;
// the painter wraps each one in a colour object at the point of use. Every
// value comes from the app: Tessera's dark theme, the accent and the look.
constexpr DWORD kGround = BROCK_C_BG;
constexpr DWORD kSurface = BROCK_C_SURFACE;
constexpr DWORD kHairline = BROCK_C_HAIRLINE;
constexpr DWORD kText = BROCK_C_TEXT;
constexpr DWORD kDim = BROCK_C_DIM;
constexpr DWORD kFaint = BROCK_C_FAINT;
constexpr DWORD kAccent = BROCK_C_ACCENT;
constexpr DWORD kTrack = BROCK_C_TRACK;
constexpr DWORD kInk = BROCK_C_ON_ACCENT;
// Barely there: present for anyone who looks for it, invisible to everyone else.
constexpr DWORD kStamp = BROCK_C_STAMP;

// The look gradient the splash and the Setup image use, in CSS terms: three
// stops and an angle where 0 points up and the turn is clockwise.
constexpr DWORD kLookFrom = BROCK_LOOK_FROM;
constexpr DWORD kLookVia = BROCK_LOOK_VIA;
constexpr DWORD kLookTo = BROCK_LOOK_TO;
constexpr float kLookAngle = BROCK_LOOK_ANGLE;
// The gradient lights the top of the window behind the mark and has given way
// to the ground by the first line of text, so every label keeps the theme's
// contrast whether the gradient is light or dark.
constexpr float kHeaderStrength = 0.85f;
// The one colour drawn straight on the gradient: light on a dark gradient,
// dark on a light one.
constexpr DWORD kHeaderInk = BROCK_C_HEADER_INK;

// product.installer: what the main button installs, whether the app starts
// when the install is done, and whether a licence has to be accepted first.
constexpr bool kMachineScope = BROCK_INSTALL_MACHINE != 0;
constexpr bool kLaunchAfter = BROCK_LAUNCH_AFTER != 0;
constexpr bool kHasLicence = BROCK_HAS_LICENCE != 0;
// product.protocols or product.fileAssociations: a portable copy registers them.
constexpr bool kRegistersOs = BROCK_REGISTERS_OS != 0;

constexpr wchar_t kFontFamily[] = L"Segoe UI";
constexpr wchar_t kProduct[] = BROCK_PRODUCT;
// Velopack's pack id, which is also the folder a per-user install lands in.
constexpr wchar_t kPackId[] = BROCK_PACK_ID;
constexpr wchar_t kBrand[] = BROCK_BRAND;
constexpr wchar_t kMainExe[] = BROCK_MAIN_EXE;
constexpr wchar_t kWindowClass[] = BROCK_WINDOW_CLASS;
constexpr wchar_t kUserAgent[] = BROCK_USER_AGENT;
constexpr wchar_t kTempPrefix[] = BROCK_TEMP_PREFIX;
// The folder name under Program Files or the profile for a chosen install.
constexpr wchar_t kInstallFolder[] = BROCK_INSTALL_FOLDER;

// The line under the mark identifies the installer itself; the status of what it is
// doing sits lower, where an error would also appear.
constexpr wchar_t kCheckingStatus[] = L"Checking for newer version...";
constexpr wchar_t kInstallerLabel[] = L"Installer";

constexpr wchar_t kHandoffTitle[] = L"A NEWER INSTALLER IS NEEDED";
constexpr wchar_t kHandoffBody[] =
    L"This installer came with an older release. The current one will take "
    L"over from here and finish the job.";
constexpr wchar_t kHandoffFine[] =
    L"About 1 MB. Your choices come after, on the new installer's own first "
    L"screen.";

constexpr wchar_t kWelcomeBlurb[] = BROCK_BLURB;
constexpr const wchar_t* kWelcomeFine =
    kMachineScope ? L"Installs for everyone on this PC. Windows asks for admin rights."
                  : L"Install for the current user only but doesn't require admin privileges.";
constexpr const wchar_t* kWelcomeFolderLabel = kMachineScope ? L"Choose folder" : L"Install globally";

constexpr wchar_t kLicenceTitle[] = L"LICENCE";
constexpr wchar_t kLicenceLead[] = L"Read the terms, then accept them to install.";
constexpr wchar_t kLicenceMissing[] = L"The licence text is missing from this installer.";
constexpr wchar_t kLocationGlobalTitle[] = L"INSTALL GLOBALLY";
constexpr wchar_t kLocationPortableTitle[] = L"PORTABLE FOLDER";
constexpr wchar_t kLocationLabel[] = L"Destination folder";
constexpr wchar_t kLocationGlobalNote[] =
    L"Everyone who signs in to this PC gets the app. The OS might ask for admin "
    L"privilege to finish this installation and during auto update.";
constexpr wchar_t kLocationPortableNote[] =
    L"In portable mode, the app files and user data all live in a single folder "
    L"and work independently from the OS.";

constexpr const wchar_t* kProgressFoot = kLaunchAfter
                                            ? L"This window closes itself and starts the app."
                                            : L"This window says when the install is done.";

constexpr wchar_t kFailChecksumText[] = L"The download did not match its signature.";
constexpr wchar_t kFailUnpackText[] = L"The archive could not be unpacked.";
constexpr wchar_t kFailLaunchText[] = L"The installer could not be started.";
constexpr wchar_t kFailNetworkText[] = L"Could not reach the release server. Check your connection.";

constexpr wchar_t kDoneTitle[] = L"INSTALLED";
constexpr wchar_t kDoneBody[] = L"Start it now, or later from its shortcut.";

}  // namespace theme
