package com.webradio.mediacontrol;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MediaControlModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    public interface ACTION {
        String PREVIOUS = "PREVIOUS";
        String PLAY = "PLAY";
        String NEXT = "NEXT";
        String SHUFFLE = "SHUFFLE";
    }
    private static final String MODULE_NAME = "MediaControl";
    private static final String EVENT_NAME = "MediaControlsAction";
    private static final String EVENT_ACTION = "action";

    private ReactApplicationContext mReactContext;

    MediaControlModule(ReactApplicationContext reactContext) {
        super(reactContext);

        mReactContext = reactContext;

        reactContext.addLifecycleEventListener(this);
   }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    private void registerReceiver() {
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(MediaControlModule.ACTION.PREVIOUS);
        intentFilter.addAction(MediaControlModule.ACTION.PLAY);
        intentFilter.addAction(MediaControlModule.ACTION.NEXT);
        intentFilter.addAction(MediaControlModule.ACTION.SHUFFLE);
        mReactContext.registerReceiver(mReceiver, intentFilter);
    }

    private void unregisterReceiver() {
        mReactContext.unregisterReceiver(mReceiver);
    }

    private BroadcastReceiver mReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();
            WritableMap params = Arguments.createMap();
            params.putString(EVENT_ACTION, action);

            try {
                mReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(EVENT_NAME, params);
            }
            catch (Exception e) {
                Log.e(MODULE_NAME, "React send event exception: " + e.getMessage());
            }
        }
    };

    @Override
    public void onHostResume() {
        registerReceiver();
    }

    @Override
    public void onHostPause() {
        unregisterReceiver();
    }

    @Override
    public void onHostDestroy() {

    }
}
