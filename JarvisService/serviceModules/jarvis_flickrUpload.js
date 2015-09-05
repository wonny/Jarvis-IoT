var Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: config.flickr.api_key,
      secret: config.flickr.secret,
      permissions: config.flickr.permissions,
      user_id: config.flickr.user_id,
      access_token: config.flickr.access_token,
      access_token_secret: config.flickr.access_token_secret
    };

var  invadeDetect = require("./jarvis_push");

//to-do : dynamic Flickr key, token, user_id .... get function

exports.invadeImageUpload = function( imageObj ){ //to-do : imageObj ( name, path, desc.... etc define )

  Flickr.authenticate(flickrOptions, function(error, flickr) {
    console.log(__dirname + "\\" + imageObj.name );
    var uploadOptions = {
      photos: [{
        title: "test",
        tags: [
          "happy fox",
          "test 1"
        ],
        photo: __dirname + "\\" + imageObj.name
      }]
    };
    //console.log("authenticate", flickr);
    Flickr.upload(uploadOptions, flickrOptions, function(err, result) {
      if(err) {
        return console.error(error);
      }
      console.log("photos uploaded", result);

      flickr.photos.search({
        api_key: flickrOptions.api_key,
        user_id: flickrOptions.user_id,
        extras : 'url_m', //url_m, url_n, url_z, url_c, url_l, url_o : perhaps photo size.....
        sort : 'date-posted-desc',
        per_page : 1
      }, function(err, result) {
        if(err) { throw new Error(err); }
        console.log("photos search", result);

        invadeDetect.sendMessage(result.photos.photo[0]);
      });

    });
  });
};