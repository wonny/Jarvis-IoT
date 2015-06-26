package com.lgcns.nodepushsample;

import java.io.IOException;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

public class MainActivity extends Activity {
	
	private String _regId;
	private GoogleCloudMessaging _gcm;
	private Context mContext;
	public TextView tokenResult = null;
	public TextView pushMessage = null;
	
	private static final String SENDER_ID = "289671096892";
	public static final String PROPERTY_REG_ID = "registration_id";
    private static final String PROPERTY_APP_VERSION = "appVersion";	
	private static final String TAG = "GCM_NODE";
	
	
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		mContext = this;
		
		tokenResult = (TextView)findViewById(R.id.result);
		pushMessage = (TextView)findViewById(R.id.pushMessage);
		
		if (checkPlayServices()) {
            _gcm = GoogleCloudMessaging.getInstance(this);
            _regId = getSharedPreference(mContext, PROPERTY_REG_ID);
 
            Log.d(TAG, "_regId = " + _regId);
            
            if (TextUtils.isEmpty(_regId)) {
                registerInBackground();
            }
        } else {
            Log.i(TAG, "No valid Google Play Services APK found.");
        }
	}
	
	@Override
	protected void onResume() {
		// TODO Auto-generated method stub
		super.onResume();
		checkPlayServices();
		
		Intent intent = getIntent();
		
		if( intent.getAction().equals("assetpush")){
			pushMessage.setText(intent.getStringExtra("result"));
		}
		
		tokenResult.setText("Device registered, registration ID = " + _regId);
	}
	
	private boolean checkPlayServices() {
        int resultCode = GooglePlayServicesUtil
                .isGooglePlayServicesAvailable(this);
        if (resultCode != ConnectionResult.SUCCESS) {
            if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
                GooglePlayServicesUtil.getErrorDialog(resultCode, this, 9000).show();
            } else {
                Log.i(TAG, "This device is not supported.");
 
                finish();
            }
            return false;
        }
        return true;
    }
	
	private static int getAppVersion(Context context) {
	    try {
	        PackageInfo packageInfo = context.getPackageManager()
	                .getPackageInfo(context.getPackageName(), 0);
	        return packageInfo.versionCode;
	    } catch (NameNotFoundException e) {
	        throw new RuntimeException("Could not get package name: " + e);
	    }
	}	
	
	private void registerInBackground() {
	    new AsyncTask<Object, Object, String>() {
	    	
			@Override
			protected String doInBackground(Object... params) {
				 String msg = "";
	            try {
	                if (_gcm == null) {
	                	_gcm = GoogleCloudMessaging.getInstance(mContext);
	                }
	                _regId = _gcm.register(SENDER_ID);
	                
	                Log.d(TAG, "Registration ID = " + _regId);
	                
	                msg = "Device registered, registration ID=" + _regId;
	                
	                storeSharedPreference(mContext, PROPERTY_REG_ID, _regId);
	                //storeSharedPreference(mContext, PROPERTY_APP_VERSION, String.valueOf(getAppVersion(mContext)));
	            } catch (IOException ex) {
	                msg = "Error :" + ex.getMessage();
	            }
	            return msg;				
			}
					
			protected void onPostExecute(String msg) {
	        	Log.d(TAG, "onPostExecute");
	        	tokenResult.setText(msg);
	        }
	    }.execute(null, null, null);	    
	}
	
	private void storeSharedPreference(Context context, String key, String value ){
		final SharedPreferences prefs = context.getSharedPreferences("pref", mContext.MODE_PRIVATE);
	    SharedPreferences.Editor editor = prefs.edit();
	    editor.putString(key, value);
	    /*if( key.equals(PROPERTY_APP_VERSION)){
	    	editor.putInt(key, Integer.parseInt(value));
	    }else{
	    	editor.putString(key, value);
	    }*/	    
	    editor.commit();
	}
	
	private String getSharedPreference(Context context, String key) {
	    final SharedPreferences prefs = context.getSharedPreferences("pref", mContext.MODE_PRIVATE);
	    
	    String registrationId = prefs.getString(key, "");
	    if (TextUtils.isEmpty(registrationId)) {
	        Log.i(TAG, "Registration not found.");
	        return "";
	    }
	    
	    /*int registeredVersion = prefs.getInt(PROPERTY_APP_VERSION, 0);
	    int currentVersion = getAppVersion(context);
	    if (registeredVersion != currentVersion) {
	        Log.i(TAG, "App version changed.");
	        return "";
	    }*/
	    return registrationId;
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		// Handle action bar item clicks here. The action bar will
		// automatically handle clicks on the Home/Up button, so long
		// as you specify a parent activity in AndroidManifest.xml.
		int id = item.getItemId();
		if (id == R.id.action_settings) {
			return true;
		}
		return super.onOptionsItemSelected(item);
	}
}
