var mongoose = require('mongoose');

var NeuronModelSchema = mongoose.Schema({
  netId: String,
  layerIndex: Number
});

module.exports = mongoose.model('Neuron', NeuronModelSchema);
