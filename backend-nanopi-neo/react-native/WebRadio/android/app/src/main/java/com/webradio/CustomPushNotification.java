package com.webradio;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.view.View;
import android.widget.RemoteViews;

import com.webradio.mediacontrol.MediaControlModule;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.notification.PushNotification;
import com.wix.reactnativenotifications.core.notification.PushNotificationProps;

class CustomPushNotification extends PushNotification {
    private final static String NOTIFICATION_CHANNEL_ID = "1";
    private final static String CHANNEL_NAME = "Webradio Notifications";

    CustomPushNotification(Context context, Bundle bundle, AppLifecycleFacade appLifecycleFacade, AppLaunchHelper appLaunchHelper, JsIOHelper jsIoHelper) {
        super(context, bundle, appLifecycleFacade, appLaunchHelper, jsIoHelper);
    }

    @Override
    protected NotificationCompat.Builder getNotificationBuilder(PendingIntent intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(NOTIFICATION_CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_LOW);

            NotificationManager notificationManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.createNotificationChannel(channel);
        }
        NotificationCompat.Builder builder = new NotificationCompat.Builder(mContext, NOTIFICATION_CHANNEL_ID)
                .setContentTitle(mNotificationProps.getTitle())
                .setContentText(mNotificationProps.getBody())
                .setSmallIcon(mContext.getApplicationInfo().icon)
                .setContentIntent(intent)
                .setDefaults(Notification.DEFAULT_ALL)
                .setOngoing(true);

        CustomPushNotificationProps props = ((CustomPushNotificationProps) mNotificationProps);
        boolean isMediaNotification = props.isMediaNotification();
        if (isMediaNotification) {
            builder.setOngoing(true);
            RemoteViews view = new RemoteViews(mContext.getPackageName(), R.layout.media_notification);

            view.setViewVisibility(R.id.shuffle_button, props.isAudioPlayer() ? View.VISIBLE : View.INVISIBLE);
            view.setImageViewResource(R.id.shuffle_button, props.isShuffle() ? R.drawable.shuffle : R.drawable.shuffle_disabled);
            view.setImageViewResource(R.id.prev_button, props.isFirstTrack() ? R.drawable.skip_previous_disabled : R.drawable.skip_previous);
            view.setImageViewResource(R.id.play_button, props.isPlay() ? R.drawable.pause : R.drawable.play_arrow);
            view.setImageViewResource(R.id.next_button, props.isLastTrack() ? R.drawable.skip_next_disabled : R.drawable.skip_next);

            view.setTextViewText(R.id.status_bar_track_name, props.getTitle());
            view.setTextViewText(R.id.status_bar_artist_name, props.getArtist());
            view.setTextViewText(R.id.status_bar_album_name, props.getBody());

            if (!props.isFirstTrack()) {
                Intent previousIntent = new Intent(MediaControlModule.ACTION.PREVIOUS);
                PendingIntent pendingPreviousIntent = PendingIntent.getBroadcast(mContext, 0, previousIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                view.setOnClickPendingIntent(R.id.prev_button, pendingPreviousIntent);
            }
            Intent playIntent = new Intent(MediaControlModule.ACTION.PLAY);
            PendingIntent pendingPlayIntent = PendingIntent.getBroadcast(mContext, 0, playIntent, PendingIntent.FLAG_UPDATE_CURRENT);
            view.setOnClickPendingIntent(R.id.play_button, pendingPlayIntent);

            if (!props.isLastTrack()) {
                Intent nextIntent = new Intent(MediaControlModule.ACTION.NEXT);
                PendingIntent pendingNextIntent = PendingIntent.getBroadcast(mContext, 0, nextIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                view.setOnClickPendingIntent(R.id.next_button, pendingNextIntent);
            }
            Intent shuffleIntent = new Intent(MediaControlModule.ACTION.SHUFFLE);
            PendingIntent pendingShuffleIntent = PendingIntent.getBroadcast(mContext, 0, shuffleIntent, PendingIntent.FLAG_UPDATE_CURRENT);
            view.setOnClickPendingIntent(R.id.shuffle_button, pendingShuffleIntent);

            builder.setCustomBigContentView(view);
        }
        return builder;
    }

    @Override
    protected PushNotificationProps createProps(Bundle bundle) {
        return new CustomPushNotificationProps(bundle);
    }
}