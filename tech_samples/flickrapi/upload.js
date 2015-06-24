
var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "eff366310adac20e46fdd630520f38bb",
      secret: "71f91ab6b56977b1",
      permissions: "delete",
      user_id: "132477211@N02",
      access_token: "72157654892450561-93beba0393a9aacd",
      access_token_secret: "50bdf8ea1983e778"
    };

Flickr.authenticate(flickrOptions, function(error, flickr) {
	console.log(__dirname + "/test.jpg");
  var uploadOptions = {
    photos: [{
      title: "test",
      tags: [
        "happy fox",
        "test 1"
      ],
      photo: __dirname + "\\" + "test.jpg"
    }]
  };

  Flickr.upload(uploadOptions, flickrOptions, function(err, result) {
    if(err) {
      return console.error(error);
    }
    console.log("photos uploaded", result);
  });
});

