package com.webradio.notification;

import android.os.Bundle;

public class PushNotificationProps {

    private static final String IS_SHUFFLE = "isShuffle";
    private static final String IS_PLAY = "isPlay";
    private static final String IS_AUDIO_PLAYER = "isAudioPlayer";
    private static final String IS_MEDIA_NOTIFICATION = "isMediaNotification";
    private static final String IS_FIRST_TRACK = "isFirstTrack";
    private static final String IS_LAST_TRACK = "isLastTrack";

    private static final String ARTIST = "artist";
    private Bundle mBundle;

    public PushNotificationProps() {
        mBundle = new Bundle();
    }

    public PushNotificationProps(String title, String body) {
        mBundle = new Bundle();
        mBundle.putString("title", title);
        mBundle.putString("body", body);
    }

    PushNotificationProps(Bundle bundle) {
        mBundle = bundle;
    }

    String getTitle() {
        return mBundle.getString("title");
    }

    String getBody() {
        return mBundle.getString("body");
    }

    Bundle asBundle() {
        return (Bundle) mBundle.clone();
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
    public String toString() {
        StringBuilder sb = new StringBuilder(1024);
        for (String key : mBundle.keySet()) {
            sb.append(key).append("=").append(mBundle.get(key)).append(", ");
        }
        return sb.toString();
    }

    protected PushNotificationProps copy() {
        return new PushNotificationProps((Bundle) mBundle.clone());
    }
}
