var Net = require('../models/NetModel.js');
var Neuron = require('../models/NeuronModel.js');
var Synapse = require('../models/SynapseModel.js')

exports.index = function(req, res, app) {
	res.render('index', {"title": "hello"});
};
exports.about = function(req, res, app) {
	res.render('about');
}
exports.storeNet = function(req, res, app) {
	console.log("net:");
	console.log(req);
	// var netEntry = new Net({
	// 	generationCount: req.body.generationCount;
	// });

	// res.body.neurons.forEach(saveNeuron);
	// netEntry.save(errorResponse);

	res.json({success: true});
}
// function saveNeuron(neuron, index, neurons) {
// 	var neuronEntry = new Neuron(neuron);
// 	neuron.forEach(saveSynapse);
// 	neuronEntry.save(saveEntry);
// }
// function saveSynapse(synapse, index, synapses) {
// 	var synapseEntry = new Synapse(synapse);
// 	synapseEntry.save(saveEntry);
// }
// function saveEntry(err, entry) {
// 	if (err) return res.send(500, 'Error occurred: unable to create new entry with body: ' + entry);
// 	return entry;
// }
