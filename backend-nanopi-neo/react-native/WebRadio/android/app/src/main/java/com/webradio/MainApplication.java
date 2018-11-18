package com.webradio;

import android.app.Application;
import android.content.Context;
import android.os.Bundle;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.oblador.vectoricons.VectorIconsPackage;
import com.webradio.mediacontrol.MediaControlPackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.notification.INotificationsApplication;
import com.wix.reactnativenotifications.core.notification.IPushNotification;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication, INotificationsApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new ReactNativeI18n(),
          new RNGestureHandlerPackage(),
          new RNNotificationsPackage(MainApplication.this),
          new MediaControlPackage(),
          new VectorIconsPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  /**
     * Implementation of INotificationsApplication:
     * Overridden to return our custom {@linkplain CustomPushNotification} class instead of
     * the default {@linkplain com.wix.reactnativenotifications.core.notification.PushNotification}.
     */
  @Override
  public IPushNotification getPushNotification(Context context, Bundle bundle, AppLifecycleFacade defaultFacade, AppLaunchHelper defaultAppLaunchHelper) {
      return new CustomPushNotification(context, bundle, defaultFacade, defaultAppLaunchHelper, new JsIOHelper());
  }
}
