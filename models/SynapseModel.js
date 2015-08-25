var mongoose = require('mongoose');

var SynapseModelSchema = mongoose.Schema({
  senderNeuronId: String,
  receiverIndex: Number,
  weight: Number
});

module.exports = mongoose.model('Synapse', SynapseModelSchema);
