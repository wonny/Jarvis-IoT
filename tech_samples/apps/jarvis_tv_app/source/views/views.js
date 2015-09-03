/**
	For simple applications, you might define all of your views in this file.  
	For more complex applications, you might choose to separate these kind definitions 
	into multiple files under this folder.
**/

enyo.kind({
	name: "myapp.MainView",
	kind: "Panels",
	classes: "panels-flickr-panels enyo-unselectable enyo-fit main-view",
	arrangerKind: "CollapsingArranger",
	key_index : 0,
	components: [
		{layoutKind: "FittableRowsLayout", components: [
			{kind: "enyo.Signals", onkeydown: "handleKeyDown"},
			{kind: "onyx.Toolbar", classes: "panels-toolbar", components: [
				{kind: "onyx.InputDecorator", alwaysLooksFocused: true, style: "width: 90%;", layoutKind: "FittableColumnsLayout", components: [
					{name: "searchInput", fit: true, kind: "onyx.Input", placeholder: "Enter text here", value: "", onchange: "search"},
					{kind: "Image", src: "assets/search.png", style: "width: 20px; height: 20px;"}
				]}
				,
				{name: "searchSpinner", kind: "Image", src: "assets/spinner.png", showing: true}
			]},
			{kind: "List", fit: true, touch: true, onSetupItem: "setupItem", components: [
				{name: "item", style: "padding: 10px;", classes: "panels-flickr-item enyo-border-box", ontap: "itemTap", components: [
					{name: "thumbnail", kind: "Image", classes: "panels-flickr-thumbnail"},
					{name: "title", classes: "panels-flickr-title"}
				]},
				{name: "more", style: "background-color: #111111;", components: [
					{kind: "onyx.Button", content: "more photos", classes: "panels-flickr-more-button", ontap: "more"},
					{name: "moreSpinner", kind: "Image", src: "assets/spinner.png", classes: "panels-flickr-more-spinner"}
				]}
			]}
		]},
		{name: "pictureView", fit: true, kind: "FittableRows", classes: "enyo-fit panels-flickr-main", components: [
			{tag: "br"},
			{kind: "moon.Divider", content: "Gallery View"},
			{name: "backToolbar", kind: "onyx.Toolbar", showing: false, components: [
				{kind: "onyx.Button", content: "Back", ontap: "showList"}
			]},
			{fit: true, style: "position: relative;", components: [
				{name: "flickrImage", kind: "Image", classes: "enyo-fit panels-flickr-center panels-flickr-image", showing: false, onload: "imageLoaded", onerror: "imageLoaded"},
				{style:"border-radius:10px; padding:15px;", components: [
				{name: "imageSpinner", kind: "onyx.Spinner", classes: 'enyo-fit onyx-light', showing: false}
			]},
			]}
		]},
		{name: "flickrSearch", kind: "enyo.PanelsFlickrSearch", onResults: "searchResults"}
	],
	rendered: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			this.search();
		};
	}),
	reflow: enyo.inherit(function(sup) {
		return function() {
			sup.apply(this, arguments);
			var backShowing = this.$.backToolbar.showing;
			this.$.backToolbar.setShowing(enyo.Panels.isScreenNarrow());
			if (this.$.backToolbar.showing != backShowing) {
				this.$.pictureView.resize();
			}
		};
	}),

    handleKeyDown: function(inSender, inEvent) {
    // Can use inEvent.keyCode to detect non-character keys
        style = "background-color: #111111";
        
        if (inEvent.keyCode === 38) {
    		// respond to up key
        	if (this.key_index > 0){
	        	this.key_index--;
	            console.log(this.key_index);
	            this.$.list.select(this.key_index, style);
	        }else if(this.key_index == 0){
	        	this.$.list.select(this.key_index, style);
	        }
        }else if(inEvent.keyCode === 40){
        	// respond to down key
        	if (this.key_index >= 0){
        		this.key_index++;
	        	this.$.list.select(this.key_index, style);
        	}
    	}      	
        
    },


	search: function() {
		this.searchText = this.$.searchInput.getValue();
		this.page = 0;
		this.results = [];
		this.$.searchSpinner.show();
		this.$.flickrSearch.search(this.searchText);
	},
	searchResults: function(inSender, inResults) {
		this.$.searchSpinner.hide();
		this.$.moreSpinner.hide();
		this.results = this.results.concat(inResults);
		this.$.list.setCount(this.results.length);
		if (this.page === 0) {
			this.$.list.reset();
		} else {
			this.$.list.refresh();
		}
	},
	setupItem: function(inSender, inEvent) {
		var i = inEvent.index;
		var item = this.results[i];
		this.$.item.addRemoveClass("onyx-selected", inSender.isSelected(inEvent.index));

		this.$.thumbnail.setSrc(item.thumbnail);
		this.$.title.setContent(item.title || "Untitled");
		this.$.more.canGenerate = !this.results[i+1];
		return true;
	},
	more: function() {
		this.page++;
		this.$.moreSpinner.show();
		this.$.flickrSearch.search(this.searchText, this.page);
	},
	itemTap: function(inSender, inEvent) {
		if (enyo.Panels.isScreenNarrow()) {
			this.setIndex(1);
		}
		this.$.imageSpinner.start();

		
		var item = this.results[inEvent.index];

		if (item.original == this.$.flickrImage.getSrc()) {
			this.imageLoaded();
		} else {
			this.$.flickrImage.hide();
			this.$.flickrImage.setSrc(item.original);
		}
	},
	imageLoaded: function() {
		var img = this.$.flickrImage;
		img.removeClass("tall");
		img.removeClass("wide");
		img.show();
		var b = img.getBounds();
		var r = b.height / b.width;
		if (r >= 1.25) {
			img.addClass("tall");
		} else if (r <= 0.8 ) {
			img.addClass("wide");
		}
		this.$.imageSpinner.stop();
	},
	showList: function() {
		this.setIndex(0);
	}
});

// A simple component to do a Flickr search.
enyo.kind({
	name: "enyo.PanelsFlickrSearch",
	kind: "Component",
	published: {
		searchText: ""
	},
	events: {
		onResults: ""
	},
	url: "https://api.flickr.com/services/rest/",
	user_id: "132477211@N02",
	pageSize: 200,
	api_key: "eff366310adac20e46fdd630520f38bb",
	search: function(inSearchText, inPage) {
		this.searchText = inSearchText || this.searchText;
		var i = (inPage || 0) * this.pageSize;
		var params = {
			method: "flickr.photos.search",
			format: "json",
			api_key: this.api_key,
			user_id : this.user_id,
			per_page: this.pageSize,
			page: i,
			text: this.searchText
		};
		var req;
		if (window.location.protocol === "ms-appx:") {
			params.nojsoncallback = 1;
			// Use ajax for platforms with no jsonp support (Windows 8)
			req = new enyo.Ajax({url: this.url, handleAs: "text"})
				.response(this, "processAjaxResponse")
				.go(params);
		} else {
			console.log(this.url);
			req = new enyo.JsonpRequest({url: this.url, callbackName: "jsoncallback"})
				.response(this, "processResponse")
				.go(params);
		}
		return req;
	},
	processAjaxResponse: function(inSender, inResponse) {
		inResponse = JSON.parse(inResponse);
		this.processResponse(inSender, inResponse);
	},
	processResponse: function(inSender, inResponse) {
		var photos = inResponse.photos ? inResponse.photos.photo || [] : [];

		for (var i=0, p; (p=photos[i]); i++) {
			//var urlprefix = "http://farm" + p.farm + ".static.flickr.com/" + p.server + "/" + p.id + "_" + p.secret;
			var urlprefix = "http://c1.staticflickr.com/" + p.farm + "/" + p.server + "/" + p.id + "_" + p.secret;
			console.log("*****************")
			console.log(urlprefix)
			p.thumbnail = urlprefix + "_s.jpg";
			p.original = urlprefix + ".jpg";
		}
		this.doResults(photos);
		return photos;
	}
});