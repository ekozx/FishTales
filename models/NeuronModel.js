var mongoose = require('mongoose');

var NeuronModelSchema = mongoose.Schema({
  netId: Number,
  layerId: Number
});

module.exports = mongoose.model('Neuron', NeuronModelSchema);
