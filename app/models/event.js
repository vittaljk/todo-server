var mongoose     = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema   = new Schema({
    name: String,
    day: String,
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', EventSchema);
