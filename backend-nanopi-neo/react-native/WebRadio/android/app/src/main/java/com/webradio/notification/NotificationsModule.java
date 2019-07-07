package com.webradio.notification;

import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class NotificationsModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "Notifications";

    NotificationsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @ReactMethod
    public void postLocalNotification(ReadableMap notificationPropsMap, int notificationId) {
        final Bundle notificationProps = Arguments.toBundle(notificationPropsMap);
        final PushNotification pushNotification = new PushNotification(getReactApplicationContext().getApplicationContext(), notificationProps);
        pushNotification.onPostRequest(notificationId);
    }

    @ReactMethod
    public void cancelLocalNotification(int notificationId) {
        PushNotification.cancelNotification(getReactApplicationContext(), notificationId);
    }

    @ReactMethod
    public void clearAllNotifications() {
        PushNotification.clearAllNotifications((getReactApplicationContext()));
    }
}
