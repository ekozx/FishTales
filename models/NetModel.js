var mongoose = require('mongoose');

var NetModelSchema = mongoose.Schema({
  generationCount: Number,
});

module.exports = mongoose.model('Net', NetModelSchema);
