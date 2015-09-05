var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var deviceSchema = new Schema({
  name : String,
  registrationID : String,
  regdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema); //collection 'Device'

