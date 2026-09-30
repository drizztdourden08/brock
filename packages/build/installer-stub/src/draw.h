// @layer installer @kind types
#pragma once

#include <windows.h>
#include <objidl.h>
#include <gdiplus.h>

#include <string>
#include <vector>

#include "paint.h"

namespace ui {
namespace draw {

// Loads the font family, the embedded mark and the licence text. The graphics
// runtime must already be started when this is called.
void Init();
void Free();

// The licence from product.installer.licence, empty when there is none.
const std::wstring& LicenceText();

// The whole window's ground: the look gradient across the top, giving way to
// the theme's background colour at `fade`, where the screen's text begins.
void Backdrop(Gdiplus::Graphics& g, float fade);

Gdiplus::Color Rgb(DWORD argb);
Gdiplus::Color Mix(DWORD a, DWORD b, float t);

void FillRound(Gdiplus::Graphics& g, const Gdiplus::RectF& r, float rad, const Gdiplus::Color& c);
void StrokeRound(Gdiplus::Graphics& g, const Gdiplus::RectF& r, float rad, const Gdiplus::Color& c);

/**
 * The installer's own version, bottom left, faint enough to be ignored. Every screen
 * carries it so a bug report can name the installer that produced it without anyone
 * having to hunt for the number.
 */
void VersionStamp(Gdiplus::Graphics& g, const ui::State& state);

// The window has no title bar, so it draws its own way out.
void CloseButton(Gdiplus::Graphics& g, std::vector<ui::Hit>* hits, const ui::State& state);

void Label(Gdiplus::Graphics& g, const wchar_t* text, float size, INT style, DWORD color,
           const Gdiplus::RectF& box, Gdiplus::StringAlignment align, bool wrap = false,
           Gdiplus::StringTrimming trim = Gdiplus::StringTrimmingNone);

void Tracked(Gdiplus::Graphics& g, const wchar_t* text, float size, DWORD color, float centerX,
             float y, float tracking);

void Logo(Gdiplus::Graphics& g, float size, float y);

void Button(Gdiplus::Graphics& g, std::vector<Hit>* hits, const State& s, Btn id,
            const Gdiplus::RectF& r, const wchar_t* label, bool primary, float fontSize);

void Bar(Gdiplus::Graphics& g, const Gdiplus::RectF& r, float fraction, float phase,
         bool determinate);

void FormatSize(unsigned long long bytes, wchar_t* out, size_t cap);

}  // namespace draw
}  // namespace ui
