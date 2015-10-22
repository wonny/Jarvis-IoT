package com.jarvis.utils;

import java.io.InputStream;
import java.net.URL;

import javax.net.ssl.HttpsURLConnection;

import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

public class ImageLoad {
	
	private static Context mContext;
	
	public static Drawable loadImageDrawable(String imageURL, Context context){
		mContext = context;
		
		Drawable drawable = null;
				
		try {			
		   	drawable = new DrawableImage().execute(imageURL).get();
		   	
		   	//InputStream inputStream = (InputStream)new URL(imageURL).getContent();
			//drawable = Drawable.createFromStream(inputStream,  null);			
		}catch(Exception e){
			e.printStackTrace();			
		}
		
		return drawable;
	}
	
	public static Bitmap loadImageBitmap(String imageURL, Context context){
		mContext = context;
		
		Bitmap bitmapImage = null;
		try{
			bitmapImage = new BitmapImage().execute(imageURL).get();			
		}catch(Exception e){
			e.printStackTrace();
		}		
		
		return bitmapImage;
	}
	
	private static class DrawableImage extends AsyncTask<String, String, Drawable>{
		Drawable drawable;
		ProgressDialog dialog;
		
		@Override
		protected void onPreExecute() {
			// TODO Auto-generated method stub
			super.onPreExecute();
			Log.d("GCM_NODE", "onPreExecute " + mContext);
			dialog = new ProgressDialog(mContext);
			dialog.setMessage("Loading Image ....");
			dialog.show();
		}
		
		@Override
		protected Drawable doInBackground(String... params) {
			try{
				drawable = Drawable.createFromStream((InputStream)new URL(params[0]).getContent(),  null);
			}catch(Exception e){
				e.printStackTrace();
			}			
			return drawable;
		}
		
		@Override
		protected void onPostExecute(Drawable drawable) {
			// TODO Auto-generated method stub
			super.onPostExecute(drawable);
			
			dialog.dismiss();
			if( drawable == null ){
				Toast.makeText(mContext, "Image Does Not exist or Network Error", Toast.LENGTH_SHORT).show();
			}
		}
		
	}
	
	private static class BitmapImage extends AsyncTask<String, String, Bitmap>{
		
		Bitmap bitmap = null;
		ProgressDialog dialog = null;
		
		@Override
		protected void onPreExecute() {
			// TODO Auto-generated method stub
			super.onPreExecute();
			
			dialog = new ProgressDialog(mContext);
			dialog.setMessage("Loading Image ....");
			dialog.show();
		}
		
		@Override
		protected Bitmap doInBackground(String... params) {
			try{
				bitmap = BitmapFactory.decodeStream((InputStream)new URL(params[0]).getContent());
			}catch(Exception e){
				e.printStackTrace();				
			}
			
			return bitmap;
		}
		
		@Override
		protected void onPostExecute(Bitmap bitmap) {
			// TODO Auto-generated method stub
			super.onPostExecute(bitmap);
			
			dialog.dismiss();
			if( bitmap == null ){
				Toast.makeText(mContext, "Image Does Not exist or Network Error", Toast.LENGTH_SHORT).show();
			}
		}
		
	}

}
