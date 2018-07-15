package com.webradio;

import android.os.Bundle;

import com.wix.reactnativenotifications.core.notification.PushNotificationProps;

class CustomPushNotificationProps extends PushNotificationProps {
    private static final String IS_SHUFFLE = "isShuffle";
    private static final String IS_PLAY = "isPlay";
    private static final String IS_AUDIO_PLAYER = "isAudioPlayer";
    private static final String IS_MEDIA_NOTIFICATION = "isMediaNotification";
    private static final String IS_FIRST_TRACK = "isFirstTrack";
    private static final String IS_LAST_TRACK = "isLastTrack";

    private static final String ARTIST = "artist";

    CustomPushNotificationProps(Bundle bundle) {
        super(bundle);
    }

    boolean isMediaNotification() {
        return mBundle.getBoolean(IS_MEDIA_NOTIFICATION);
    }

    boolean isShuffle() {
        return mBundle.getBoolean(IS_SHUFFLE);
    }

    boolean isPlay() {
        return mBundle.getBoolean(IS_PLAY);
    }

    boolean isAudioPlayer() {
        return mBundle.getBoolean(IS_AUDIO_PLAYER);
    }

    boolean isFirstTrack() {
        return mBundle.getBoolean(IS_FIRST_TRACK);
    }

    boolean isLastTrack() {
        return mBundle.getBoolean(IS_LAST_TRACK);
    }

    String getArtist() {
        return mBundle.getString(ARTIST);
    }

    @Override
    protected CustomPushNotificationProps copy() {
        return new CustomPushNotificationProps((Bundle) mBundle.clone());
    }
}