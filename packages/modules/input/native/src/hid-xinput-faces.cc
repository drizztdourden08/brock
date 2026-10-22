/* @layer electron-main @kind native */
// XInputFaces: pairs a HID device with the XInput interface of the same pad
// through its Windows device container. See hid-xinput-faces.h for why.
#include "hid-xinput-faces.h"

#ifdef _WIN32

#include <windows.h>
#include <initguid.h>
#include <devpkey.h>
#include <cfgmgr32.h>

#include <cstdio>
#include <cwctype>
#include <vector>

namespace {

// GUID_DEVINTERFACE_HID, spelled out so this file needs no hid.lib.
constexpr GUID kHidInterface = {0x4d1e55b2, 0xf16f, 0x11cf, {0x88, 0xcb, 0x00, 0x11, 0x11, 0x00, 0x00, 0x30}};

// Every built-in device shares this container, so it says nothing about one
// pad. A root-enumerated virtual pad can land here too.
constexpr GUID kMachineContainer = {0x00000000, 0x0000, 0x0000, {0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff}};
constexpr GUID kNoContainer = {0x00000000, 0x0000, 0x0000, {0, 0, 0, 0, 0, 0, 0, 0}};

// Bounded, since the interface list can grow between the size and the read.
constexpr int kListAttempts = 3;

std::wstring Widen(const char* utf8) {
  int length = MultiByteToWideChar(CP_UTF8, 0, utf8, -1, nullptr, 0);
  if (length <= 1) {
    return L"";
  }
  std::wstring wide(static_cast<size_t>(length), L'\0');
  MultiByteToWideChar(CP_UTF8, 0, utf8, -1, wide.data(), length);
  wide.resize(static_cast<size_t>(length - 1));
  return wide;
}

// The container id of the device behind an interface path, as text. Empty
// when Windows cannot say, or for a container that names no single device.
std::string ContainerOf(const wchar_t* interfacePath) {
  wchar_t instanceId[MAX_DEVICE_ID_LEN] = {};
  ULONG size = sizeof(instanceId);
  DEVPROPTYPE type = DEVPROP_TYPE_EMPTY;
  if (CM_Get_Device_Interface_PropertyW(interfacePath, &DEVPKEY_Device_InstanceId, &type,
                                        reinterpret_cast<PBYTE>(instanceId), &size, 0) != CR_SUCCESS ||
      type != DEVPROP_TYPE_STRING) {
    return "";
  }

  DEVINST node = 0;
  if (CM_Locate_DevNodeW(&node, instanceId, CM_LOCATE_DEVNODE_NORMAL) != CR_SUCCESS) {
    return "";
  }

  GUID container = kNoContainer;
  size = sizeof(container);
  if (CM_Get_DevNode_PropertyW(node, &DEVPKEY_Device_ContainerId, &type,
                               reinterpret_cast<PBYTE>(&container), &size, 0) != CR_SUCCESS ||
      type != DEVPROP_TYPE_GUID) {
    return "";
  }
  if (IsEqualGUID(container, kNoContainer) || IsEqualGUID(container, kMachineContainer)) {
    return "";
  }

  char text[40] = {};
  std::snprintf(text, sizeof(text), "%08lx-%04x-%04x-%02x%02x-%02x%02x%02x%02x%02x%02x",
                container.Data1, container.Data2, container.Data3, container.Data4[0], container.Data4[1],
                container.Data4[2], container.Data4[3], container.Data4[4], container.Data4[5],
                container.Data4[6], container.Data4[7]);
  return text;
}

// Same test hidapi uses to skip XInput interfaces, without its case trap.
bool IsXInputInterface(const wchar_t* path) {
  std::wstring upper(path);
  for (wchar_t& c : upper) {
    c = static_cast<wchar_t>(std::towupper(c));
  }
  return upper.find(L"&IG_") != std::wstring::npos;
}

// Every present HID interface path, or an empty list on failure.
std::vector<wchar_t> PresentHidInterfaces() {
  GUID hid = kHidInterface;
  for (int attempt = 0; attempt < kListAttempts; ++attempt) {
    ULONG length = 0;
    if (CM_Get_Device_Interface_List_SizeW(&length, &hid, nullptr, CM_GET_DEVICE_INTERFACE_LIST_PRESENT) !=
            CR_SUCCESS ||
        length <= 1) {
      return {};
    }
    std::vector<wchar_t> list(length);
    CONFIGRET result =
        CM_Get_Device_Interface_ListW(&hid, nullptr, list.data(), length, CM_GET_DEVICE_INTERFACE_LIST_PRESENT);
    if (result == CR_SUCCESS) {
      return list;
    }
    if (result != CR_BUFFER_SMALL) {
      return {};
    }
  }
  return {};
}

}  // namespace

XInputFaces::XInputFaces() {
  std::vector<wchar_t> list = PresentHidInterfaces();
  for (const wchar_t* path = list.data(); !list.empty() && *path != L'\0'; path += wcslen(path) + 1) {
    if (!IsXInputInterface(path)) {
      continue;
    }
    std::string container = ContainerOf(path);
    if (!container.empty()) {
      containers_.insert(container);
    }
  }
}

bool XInputFaces::Has(const char* hidPath) const {
  if (containers_.empty() || hidPath == nullptr) {
    return false;
  }
  std::wstring path = Widen(hidPath);
  if (path.empty() || IsXInputInterface(path.c_str())) {
    return false;
  }
  std::string container = ContainerOf(path.c_str());
  return !container.empty() && containers_.count(container) > 0;
}

#else

XInputFaces::XInputFaces() = default;

bool XInputFaces::Has(const char* hidPath) const {
  (void)hidPath;
  return false;
}

#endif
