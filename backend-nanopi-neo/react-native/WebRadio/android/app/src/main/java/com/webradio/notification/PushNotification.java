package com.webradio.notification;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;

import com.webradio.MainActivity;
import com.webradio.R;
import com.webradio.mediacontrol.MediaControlModule;

class PushNotification {
    private final static String NOTIFICATION_CHANNEL_ID = "1";
    private final static String CHANNEL_NAME = "Webradio Notifications";
    final private Context mContext;
    final private PushNotificationProps mNotificationProps;

    private static final String PUSH_NOTIFICATION_EXTRA_NAME = "pushNotification";

    PushNotification(Context context, Bundle bundle) {
        mContext = context;
        mNotificationProps = new PushNotificationProps(bundle);
    }

    void onPostRequest(Integer notificationId) {
        final Intent intent = new Intent(mContext, MainActivity.class);

        intent.putExtra(PUSH_NOTIFICATION_EXTRA_NAME, mNotificationProps.asBundle());
        final PendingIntent pendingIntent = PendingIntent.getService(mContext, (int) System.currentTimeMillis(), intent, PendingIntent.FLAG_ONE_SHOT);
        final Notification notification = buildNotification(pendingIntent);
        final NotificationManager notificationManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(notificationId, notification);
    }

    static void clearAllNotifications(Context context) {
        final NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancelAll();
    }

    static void cancelNotification(Context context, int notificationId) {
        final NotificationManager notificationManager = (NotificationManager) context.getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.cancel(notificationId);
    }

    private Notification buildNotification(PendingIntent intent) {
        Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(NOTIFICATION_CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_LOW);

            NotificationManager notificationManager = (NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.createNotificationChannel(channel);

            builder = new Notification.Builder(mContext, NOTIFICATION_CHANNEL_ID);
        } else {
            builder = new Notification.Builder(mContext);
        }
        builder.setContentTitle(mNotificationProps.getTitle())
                .setContentText(mNotificationProps.getBody())
                .setSmallIcon(mContext.getApplicationInfo().icon)
                .setContentIntent(intent)
                .setDefaults(Notification.DEFAULT_ALL)
                .setOngoing(true);

        PushNotificationProps props = mNotificationProps;
        boolean isMediaNotification = props.isMediaNotification();
        if (isMediaNotification) {
            builder.setOngoing(true);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
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
        }
        return builder.build();
    }
}