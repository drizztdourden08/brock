package com.drizztdourden08.brock.input;

import android.view.InputDevice;
import android.view.KeyEvent;
import android.view.MotionEvent;

import org.libsdl.app.SDLControllerManager;

public final class Sdl3InputRouter {

    private Sdl3InputRouter() {
    }

    public static boolean handleKeyEvent(KeyEvent event) {
        if (!Sdl3Bridge.isRunning()) return false;
        int deviceId = event.getDeviceId();
        if (!SDLControllerManager.isDeviceSDLJoystick(deviceId)) return false;
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            return SDLControllerManager.onNativePadDown(deviceId, event.getKeyCode(), event.getScanCode());
        }
        if (event.getAction() == KeyEvent.ACTION_UP) {
            return SDLControllerManager.onNativePadUp(deviceId, event.getKeyCode(), event.getScanCode());
        }
        return false;
    }

    public static boolean handleGenericMotionEvent(MotionEvent event) {
        if (!Sdl3Bridge.isRunning()) return false;
        if ((event.getSource() & InputDevice.SOURCE_CLASS_JOYSTICK) == 0) return false;
        return SDLControllerManager.handleJoystickMotionEvent(event);
    }
}
