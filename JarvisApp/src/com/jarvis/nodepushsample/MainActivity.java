package com.jarvis.nodepushsample;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;
import com.jarvis.nodepushsample.R;
import com.jarvis.utils.ImageLoad;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ImageView;
import android.widget.TextView;

public class MainActivity extends Activity {
	
	private String _regId;
	private GoogleCloudMessaging _gcm;
	private Context mContext;
	public TextView tokenResult = null;
	public TextView pushMessage = null;
	public ImageView detectImage = null;
	
	private static final String SENDER_ID = "132145393522"; // ProjectID
	public static final String PROPERTY_REG_ID = "registration_id";
    private static final String PROPERTY_APP_VERSION = "appVersion";	
	private static final String TAG = "GCM_NODE";
	private static final String REG_URL = "http://192.168.0.50:9000/api/insert";
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		mContext = this;
		
		tokenResult = (TextView)findViewById(R.id.result);
		pushMessage = (TextView)findViewById(R.id.pushMessage);
		detectImage = (ImageView)findViewById(R.id.imageView);
		
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
		
		if( intent.getAction().equals("jarvis-push")){
			pushMessage.setText(intent.getStringExtra("result"));
			
			try {
				JSONObject data = new JSONObject(intent.getStringExtra("result"));
				Log.d(TAG, "onResume : " + data.getString("imagepath"));
				//detectImage.set : USE Drawable
				detectImage.setImageDrawable(ImageLoad.loadImageDrawable(data.getString("imagepath"), mContext));
				tokenResult.setText(data.getString("message"));
				
				//detectImage.set : USE Bitmap
				//detectImage.setImageBitmap(ImageLoad.loadImageBitmap(data.getString("imagepath"), mContext));
			} catch (JSONException e) {			
				e.printStackTrace();
			}
		}
	}
	
	@Override
	//foreground intent receive ( cycle : foreground App -> intent reveive -> onNewIntent -> onResume )
	protected void onNewIntent(Intent intent) {
		// TODO Auto-generated method stub
		super.onNewIntent(intent);		
		setIntent(intent);		
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
	                
	                if( !_regId.equals("") ){
	                	registerUserToken(_regId);
	                }
	                
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
	
	private void registerUserToken(String registrationId){
		HttpClient client = new DefaultHttpClient();
		HttpPost setRegId = new HttpPost(REG_URL);
		
		HttpResponse response;
		Log.d(TAG, "registerUserToken = " + registrationId);
		Log.d(TAG, "registerUserToken = " + Build.MODEL);
		try{			
			List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
			nameValuePairs.add(new BasicNameValuePair("name", Build.MODEL));
	        nameValuePairs.add(new BasicNameValuePair("registrationID", registrationId));
	        Log.d(TAG, "1");
	        setRegId.setEntity(new UrlEncodedFormEntity(nameValuePairs, "UTF-8"));
	        Log.d(TAG, "2");
	        response = client.execute(setRegId);
	        Log.d(TAG, "3");
	        String info = EntityUtils.toString(response.getEntity(), "UTF-8");
	        Log.d(TAG, "4");
	        response.getEntity().consumeContent();
	        Log.d(TAG, "5");
	        Log.d(TAG, "info = " + info);
			
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			if( client != null ){
				client.getConnectionManager().shutdown();
			}					
		}		
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
}
