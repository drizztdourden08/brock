package com.drizztdourden08.brock.input;

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Sdl3Bridge {
    private static final String TAG = "BrockInput";
    private static final long POLL_INTERVAL_MS = 16;

    public interface Listener {
        void onControllerEvent(JSONObject event);
    }

    private static boolean libraryLoaded;
    private static boolean libraryLoadAttempted;
    private static volatile boolean running;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Listener listener;
    private boolean polling;

    private final Runnable pollTask = new Runnable() {
        @Override
        public void run() {
            if (!polling) return;
            pollOnce();
            handler.postDelayed(this, POLL_INTERVAL_MS);
        }
    };

    public Sdl3Bridge(Listener listener) {
        this.listener = listener;
    }

    public static boolean isRunning() {
        return running;
    }

    public static synchronized boolean ensureLibraryLoaded() {
        if (libraryLoadAttempted) return libraryLoaded;
        libraryLoadAttempted = true;
        try {
            System.loadLibrary("brockinput");
            libraryLoaded = true;
        } catch (UnsatisfiedLinkError e) {
            Log.w(TAG, "brockinput native library not available: " + e.getMessage());
            libraryLoaded = false;
        }
        return libraryLoaded;
    }

    public static String version() {
        return ensureLibraryLoaded() ? nativeVersion() : null;
    }

    public boolean start(Activity activity) {
        if (!ensureLibraryLoaded()) return false;
        if (running) return true;
        org.libsdl.app.SDL.setupJNI();
        org.libsdl.app.SDL.initialize();
        org.libsdl.app.SDL.setContext(activity);
        if (!nativeStart()) {
            Log.e(TAG, "SDL_Init(SDL_INIT_GAMEPAD) failed");
            return false;
        }
        running = true;
        resume();
        return true;
    }

    public void pause() {
        polling = false;
        handler.removeCallbacks(pollTask);
    }

    public void resume() {
        if (!running || polling) return;
        polling = true;
        handler.post(pollTask);
    }

    public void stop() {
        if (!running) return;
        pause();
        running = false;
        nativeStop();
    }

    public boolean rumble(int id, float low, float high, int durationMs) {
        return running && nativeRumble(id, low, high, durationMs);
    }

    public boolean addMapping(String mapping) {
        return running && nativeAddMapping(mapping);
    }

    public String mappingForGuid(String guid) {
        return running ? nativeMappingForGuid(guid) : null;
    }

    private void pollOnce() {
        String json = nativePollEvents();
        if (json == null || json.equals("[]")) return;
        try {
            JSONArray events = new JSONArray(json);
            for (int i = 0; i < events.length(); i++) {
                listener.onControllerEvent(events.getJSONObject(i));
            }
        } catch (JSONException e) {
            Log.e(TAG, "Malformed event batch from nativePollEvents(): " + e.getMessage());
        }
    }

    private static native boolean nativeStart();
    private static native void nativeStop();
    private static native String nativePollEvents();
    private static native boolean nativeRumble(int id, float low, float high, int durationMs);
    private static native boolean nativeAddMapping(String mapping);
    private static native String nativeMappingForGuid(String guid);
    private static native String nativeVersion();
}
