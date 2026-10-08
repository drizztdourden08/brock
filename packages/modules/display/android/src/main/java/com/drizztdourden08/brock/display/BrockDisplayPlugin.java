package com.drizztdourden08.brock.display;

import android.content.Context;
import android.hardware.display.DisplayManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.util.DisplayMetrics;
import android.view.Display;
import android.view.Window;
import android.view.WindowManager;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "BrockDisplay")
public class BrockDisplayPlugin extends Plugin {

    private DisplayManager displayManager;

    private final DisplayManager.DisplayListener displayListener = new DisplayManager.DisplayListener() {
        @Override
        public void onDisplayAdded(int displayId) {
            notifyListeners("changed", new JSObject());
        }

        @Override
        public void onDisplayRemoved(int displayId) {
            notifyListeners("changed", new JSObject());
        }

        @Override
        public void onDisplayChanged(int displayId) {
            notifyListeners("changed", new JSObject());
        }
    };

    @Override
    public void load() {
        displayManager = (DisplayManager) getContext().getSystemService(Context.DISPLAY_SERVICE);
        if (displayManager != null) displayManager.registerDisplayListener(displayListener, new Handler(Looper.getMainLooper()));
    }

    @Override
    protected void handleOnDestroy() {
        if (displayManager != null) displayManager.unregisterDisplayListener(displayListener);
    }

    @PluginMethod
    public void getDisplayInfo(PluginCall call) {
        getActivity().runOnUiThread(() -> call.resolve(displayInfo()));
    }

    @PluginMethod
    public void setPreferredRate(PluginCall call) {
        float hz = call.getDouble("hz", 0.0).floatValue();
        getActivity().runOnUiThread(() -> {
            JSObject result = new JSObject();
            Window window = getActivity() != null ? getActivity().getWindow() : null;
            if (window == null) {
                result.put("applied", false);
                result.put("reason", "The app has no window yet.");
            } else {
                WindowManager.LayoutParams params = window.getAttributes();
                params.preferredRefreshRate = Math.max(0f, hz);
                window.setAttributes(params);
                result.put("applied", true);
            }
            call.resolve(result);
        });
    }

    private JSObject displayInfo() {
        JSObject info = new JSObject();
        Display display = display();
        JSArray supported = new JSArray();
        float current = 0f;
        if (display != null) {
            current = display.getRefreshRate();
            for (float hz : display.getSupportedRefreshRates()) supported.put(Double.valueOf(hz));
        }
        DisplayMetrics metrics = getContext().getResources().getDisplayMetrics();
        Window window = getActivity() != null ? getActivity().getWindow() : null;
        info.put("currentHz", (double) current);
        info.put("supportedHz", supported);
        info.put("preferredHz", window != null ? (double) window.getAttributes().preferredRefreshRate : 0.0);
        info.put("width", metrics.widthPixels);
        info.put("height", metrics.heightPixels);
        info.put("density", (double) metrics.density);
        return info;
    }

    private Display display() {
        if (getActivity() == null) return null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) return getActivity().getDisplay();
        return getActivity().getWindowManager().getDefaultDisplay();
    }
}
