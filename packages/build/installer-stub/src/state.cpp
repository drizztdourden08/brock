// @layer installer @kind logic
#include "state.h"

#include "flow.h"
#include "install.h"
#include "theme.h"

namespace app {
namespace {

void GoLocation(HWND window, ui::Mode mode) {
  g.ui.mode = mode;
  g.ui.path = install::DefaultPath(mode);
  g.ui.freeSpace = install::FreeSpaceLine(g.ui.path);
  g.ui.screen = ui::Screen::Location;
  Repaint(window);
}

void BeginInstall(HWND window, ui::Mode mode) {
  g.ui.mode = mode;
  g.ui.bytesDone = 0;
  g.ui.bytesTotal = 0;
  g.ui.screen = ui::Screen::Progress;
  flow::StartInstall(window, mode, g.ui.path);
  Repaint(window);
}

// A licence set in the product config stands between every install button and
// the install itself; accepting it once covers whichever mode was chosen.
void RequestInstall(HWND window, ui::Mode mode) {
  if (!theme::kHasLicence || g.licenceAccepted) {
    BeginInstall(window, mode);
    return;
  }
  g.ui.mode = mode;
  g.licenceBack = g.ui.screen;
  g.ui.screen = ui::Screen::Licence;
  Repaint(window);
}

}  // namespace

Shell g;

bool Busy() { return g.ui.screen == ui::Screen::Progress; }

ui::Btn HitTest(int x, int y) {
  int lx = static_cast<int>(x / g.scale);
  int ly = static_cast<int>(y / g.scale);
  for (const ui::Hit& hit : g.hits) {
    if (lx >= hit.rect.left && lx < hit.rect.right && ly >= hit.rect.top && ly < hit.rect.bottom) {
      return hit.id;
    }
  }
  return ui::Btn::None;
}

void Repaint(HWND window) { InvalidateRect(window, nullptr, FALSE); }

void OnClick(HWND window, ui::Btn id) {
  switch (id) {
    case ui::Btn::Install: {
      ui::Mode mode = theme::kMachineScope ? ui::Mode::Global : ui::Mode::PerUser;
      g.ui.path = install::DefaultPath(mode);
      RequestInstall(window, mode);
      break;
    }
    case ui::Btn::Global: GoLocation(window, ui::Mode::Global); break;
    case ui::Btn::Portable: GoLocation(window, ui::Mode::Portable); break;
    case ui::Btn::Back:
      g.ui.screen = g.ui.screen == ui::Screen::Licence ? g.licenceBack : ui::Screen::Welcome;
      Repaint(window);
      break;
    case ui::Btn::Browse:
      if (install::BrowseForFolder(window, &g.ui.path)) {
        g.ui.freeSpace = install::FreeSpaceLine(g.ui.path);
      }
      Repaint(window);
      break;
    case ui::Btn::Confirm: RequestInstall(window, g.ui.mode); break;
    case ui::Btn::Accept:
      g.licenceAccepted = true;
      BeginInstall(window, g.ui.mode);
      break;
    case ui::Btn::ReadLicence: install::OpenLicence(); break;
    case ui::Btn::Launch:
      install::LaunchInstalled(install::InstalledRoot(g.ui.mode, g.ui.path));
      DestroyWindow(window);
      break;
    case ui::Btn::Continue:
      g.ui.bytesDone = 0;
      g.ui.bytesTotal = 0;
      g.ui.screen = ui::Screen::Progress;
      flow::StartHandoff(window);
      Repaint(window);
      break;
    case ui::Btn::Cancel:
    // A download in progress has to be abandoned, never left running: the
    // worker sees the cancel and stops before anything is written.
    case ui::Btn::Close: flow::Cancel(); DestroyWindow(window); break;
    default: break;
  }
}

void OnManifestReady(HWND window) {
  const manifest::Document& doc = flow::Doc();
  g.ui.version = doc.version.empty() ? L"latest" : doc.version;
  wchar_t mine[16];
  wchar_t needed[16];
  swprintf_s(mine, L"%d.0", theme::kStubVersion);
  swprintf_s(needed, L"%d.0", doc.stubVersion);
  g.ui.stubVersion = mine;
  g.ui.requiredVersion = needed;
  bool outdated = doc.stubVersion > theme::kStubVersion && !doc.stub.url.empty();
  g.ui.screen = (outdated && !g.handoff) ? ui::Screen::Handoff : ui::Screen::Welcome;
  Repaint(window);
}

void OnInstalled(HWND window) {
  g.ui.screen = ui::Screen::Done;
  Repaint(window);
}

void OnFailed(HWND window, WPARAM reason) {
  switch (reason) {
    case flow::kFailChecksum: g.ui.error = theme::kFailChecksumText; break;
    case flow::kFailUnpack: g.ui.error = theme::kFailUnpackText; break;
    case flow::kFailLaunch: g.ui.error = theme::kFailLaunchText; break;
    default: g.ui.error = theme::kFailNetworkText; break;
  }
  g.ui.screen = ui::Screen::Checking;
  Repaint(window);
}

}  // namespace app
