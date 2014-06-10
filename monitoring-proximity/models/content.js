var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContentSchema = new Schema({
    uuid: {type:String, default: ''},
    minor: {type:Number, default: 0},
    major: {type:Number, default: 0},
    identifier: {type:String, default: ''},
    name: {type:String, default: ''},
    image_data: {type:String, default: ''}
});


var Content = mongoose.model('Content', ContentSchema);

module.exports = Content;
