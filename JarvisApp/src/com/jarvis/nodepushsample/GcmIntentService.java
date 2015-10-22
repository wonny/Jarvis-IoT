package com.jarvis.nodepushsample;

import java.util.Iterator;

import org.json.JSONObject;

import android.app.IntentService;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.jarvis.nodepushsample.R;


public class GcmIntentService extends IntentService {
	
	private static final String TAG = GcmIntentService.class.getSimpleName();
		
	public GcmIntentService() {
        super("GcmIntentService");
    }
		
	@Override
	protected void onHandleIntent(Intent intent) {
		Bundle extras = intent.getExtras();
        GoogleCloudMessaging gcm = GoogleCloudMessaging.getInstance(this);
        // The getMessageType() intent parameter must be the intent you received
        // in your BroadcastReceiver.
        String messageType = gcm.getMessageType(intent);
        
        if (!extras.isEmpty()) {  // has effect of unparcelling Bundle
            /*
             * Filter messages based on message type. Since it is likely that GCM
             * will be extended in the future with new message types, just ignore
             * any message types you're not interested in, or that you don't
             * recognize.
             */
            if (GoogleCloudMessaging.MESSAGE_TYPE_SEND_ERROR.equals(messageType)) {
               // sendNotification("Send error: " + extras.toString());
            } else if (GoogleCloudMessaging.MESSAGE_TYPE_DELETED.equals(messageType)) {
               
            // If it's a regular GCM message, do some work.
            } else if (GoogleCloudMessaging.MESSAGE_TYPE_MESSAGE.equals(messageType)) {
                // This loop represents the service doing some work.
                
                // Post notification of received message.
                Log.d(TAG, "Received: " + extras.toString());
                
                Bundle b = intent.getExtras();        		
        		JSONObject data = new JSONObject();

        		Iterator<String> iterator = b.keySet().iterator();
        		
        		try {
        			while(iterator.hasNext()) {
        				String key = iterator.next();
        				String value = b.get(key).toString();
        				data.put(key, value);
        				Log.d(TAG, "onMessage. "+key+" : "+value);
        			}
        			
        			if( data.get("collapse_key") != null && data.get("collapse_key").toString().equals("Jarvis") ){   
                    	generateNotification( getApplicationContext(), "Jarvis Push Message", data);
                    }
        		}catch(Exception e){
        			e.printStackTrace();
        		}
            }
            
        }
        // Release the wake lock provided by the WakefulBroadcastReceiver.
        GcmBroadcastReceiver.completeWakefulIntent(intent);
    }

	private static void generateNotification(Context context, String message, JSONObject data ) {
	    
        int icon = R.drawable.ic_launcher;        
        
        NotificationManager notificationManager = (NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
        Notification notification = new Notification();
        notification.icon = icon;
        
        String title = context.getString(R.string.app_name);
        
        Intent notificationIntent = new Intent(context, MainActivity.class);
        
        try {
        	notificationIntent.setAction("jarvis-push");
        	notificationIntent.putExtra("result", data.toString() );
        	Log.d("GCM_NODE", "INTENT : " + data.getString("imagepath"));
        }catch(Exception e){
        	e.printStackTrace();
        }
                
        
        // set intent so it does not start a new activity
        notificationIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent intent = PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        
        notification.setLatestEventInfo(context, title, message, intent);
        notification.flags |= Notification.FLAG_AUTO_CANCEL;

        notificationManager.notify(0, notification);      

    }

}
