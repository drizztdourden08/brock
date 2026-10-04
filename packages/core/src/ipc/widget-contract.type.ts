/* @layer core @kind types */
import type {
  PoppedWidgetPatch, WidgetDockBack, WidgetFrameWire, WidgetPinMode, WidgetPrefsWire, WidgetProbeRequest, WidgetProbeResult, WidgetSettingsWire, WidgetSlice,
  WidgetWindowBounds, WidgetWindowInfo, WidgetWindowOpen, WidgetWindowPoint, WidgetWindowState, WindowGuideState,
} from './widget-window.type';

interface WidgetInvokeContract {
  'widget:popOut': (id: string, popped?: WidgetWindowOpen) => Promise<void>;
  'widget:listPopped': () => Promise<WidgetWindowInfo[]>;
  'widget:setPin': (id: string, mode: WidgetPinMode) => Promise<WidgetPinMode>;
  'widget:getWindowState': (id: string) => Promise<WidgetWindowState | null>;
  'review:setWidgetPref': (id: string, key: string, value: unknown) => Promise<boolean>;
  'review:widgetProbe': (request: WidgetProbeRequest) => Promise<WidgetProbeResult>;
  'review:captureWidget': (id: string, step: string) => Promise<string | null>;
  'review:captureGroup': (step: string) => Promise<string | null>;
}

interface WidgetSendContract {
  'widget:dockBack': (id: string, where?: WidgetDockBack) => void;
  'widget:setSnap': (id: string, on: boolean) => void;
  'widget:setSync': (id: string, on: boolean) => void;
  'widget:setFrame': (id: string, patch: Partial<WidgetFrameWire>) => void;
  'widget:publish': (slice: WidgetSlice) => void;
  'widget:subscribe': (id: string) => void;
  'widget:setPrefs': (id: string, prefs: WidgetPrefsWire) => void;
  'widget:patchSettings': (patch: WidgetSettingsWire) => void;
}

interface WidgetEventContract {
  'widget:relay': (slice: WidgetSlice) => void;
  'widget:snapshotRequest': (id: string) => void;
  'widget:closed': (id: string, where?: WidgetDockBack, seq?: number) => void;
  'widget:bounds': (id: string, bounds: WidgetWindowBounds) => void;
  'widget:dragOver': (id: string, point: WidgetWindowPoint | null) => void;
  'widget:dropIn': (id: string, point: WidgetWindowPoint) => void;
  'widget:popped': (id: string, patch: PoppedWidgetPatch) => void;
  'widget:frame': (id: string, patch: Partial<WidgetFrameWire>) => void;
  'widget:windowState': (state: WidgetWindowState) => void;
  'widget:guide': (state: WindowGuideState) => void;
  'widget:square': (on: boolean) => void;
  'widget:prefs': (id: string, prefs: WidgetPrefsWire) => void;
  'widget:settingsPatch': (patch: WidgetSettingsWire) => void;
  'review:widgetPref': (key: string, value: unknown) => void;
}

export type { WidgetEventContract, WidgetInvokeContract, WidgetSendContract };
