var mongoose = require('mongoose');

var SynapseModelSchema = mongoose.Schema({
  senderNeuronId: Number,
  receiverNeuronId: Number,
  weight: Number
});

module.exports = mongoose.model('Synapse', SynapseModelSchema);
