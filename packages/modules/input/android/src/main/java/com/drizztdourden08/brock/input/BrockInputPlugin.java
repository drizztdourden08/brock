package com.drizztdourden08.brock.input;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name = "BrockInput")
public class BrockInputPlugin extends Plugin implements Sdl3Bridge.Listener {

    private Sdl3Bridge bridge;

    @Override
    public void load() {
        bridge = new Sdl3Bridge(this);
        ControllerWindowCallback.install(getActivity());
    }

    @Override
    protected void handleOnPause() {
        getActivity().runOnUiThread(bridge::pause);
    }

    @Override
    protected void handleOnResume() {
        getActivity().runOnUiThread(bridge::resume);
    }

    @Override
    protected void handleOnDestroy() {
        bridge.stop();
    }

    @PluginMethod
    public void start(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            JSObject ret = new JSObject();
            boolean ok = bridge.start(getActivity());
            ret.put("ok", ok);
            if (ok) ret.put("version", Sdl3Bridge.version());
            call.resolve(ret);
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            bridge.stop();
            call.resolve();
        });
    }

    @PluginMethod
    public void rumble(PluginCall call) {
        int id = call.getInt("id", -1);
        float low = call.getDouble("low", 0.0).floatValue();
        float high = call.getDouble("high", 0.0).floatValue();
        int durationMs = call.getInt("durationMs", 0);
        getActivity().runOnUiThread(() -> resolveOk(call, bridge.rumble(id, low, high, durationMs)));
    }

    @PluginMethod
    public void addMapping(PluginCall call) {
        String mapping = call.getString("mapping", "");
        getActivity().runOnUiThread(() -> resolveOk(call, bridge.addMapping(mapping)));
    }

    @PluginMethod
    public void mappingForGuid(PluginCall call) {
        String guid = call.getString("guid", "");
        getActivity().runOnUiThread(() -> {
            JSObject ret = new JSObject();
            String mapping = bridge.mappingForGuid(guid);
            if (mapping != null) ret.put("mapping", mapping);
            call.resolve(ret);
        });
    }

    @Override
    public void onControllerEvent(JSONObject event) {
        try {
            notifyListeners("controllerEvent", new JSObject(event.toString()));
        } catch (JSONException e) {
            android.util.Log.e("BrockInput", "Malformed controller event: " + e.getMessage());
        }
    }

    private static void resolveOk(PluginCall call, boolean ok) {
        JSObject ret = new JSObject();
        ret.put("ok", ok);
        call.resolve(ret);
    }
}
