var mongoose = require('mongoose');

var NetModelSchema = mongoose.Schema({
  generationCount: Number,
  fitness: Number,
  name: String
});

module.exports = mongoose.model('Net', NetModelSchema);
