var Net = require('../models/NetModel.js');
var Neuron = require('../models/NeuronModel.js');
var Synapse = require('../models/SynapseModel.js');
var ObjectId = require('mongoose').Types.ObjectId;
var rsvp = require('rsvp');

exports.index = function(req, res, app) {
	res.render('index', {"title": "hello"});
};
exports.about = function(req, res, app) {
	res.render('about');
}

/**
* Saves a neural net by
*/
var saveNet = function(generation) {
	return new rsvp.Promise(function(resolve, reject) {
		var netEntry = new Net({
			generationCount: generation
		});
		netEntry.save(function(err, record) {
			if (err) { reject(this); }
			else {
				resolve(new ObjectId(record._id));
			}
		});
	});
}
var saveNeurons = function(netId, layers) {
	return layers.map(function(layer, layerCount) {
		return layer.map(function(neuron, neuronCount) {
			return saveNeuron(neuron, netId, layerCount);
		});
	}).reduce(function(curArr, nextArr) {
		return curArr.concat(nextArr);
	});
}
var saveNeuron = function(neuron, netId, layerCount) {
	return new rsvp.Promise(function(resolve, reject) {
		var neuronEntry = new Neuron({
			netId: netId,
			layerIndex: layerCount
		});
		neuronEntry.save(function(err, record) {
			if(err) { reject(this); }
			else {
				resolve({
					neuronRecord: record,
					synapses: neuron,
					neuronId: new ObjectId(record.id)
				});
			}
		});
	});
}
var saveSynapses = function(neurons) {
	return neurons.map(function(neuronRep, layerCount) {
		return neuronRep.synapses.map(function(synapse, synapseCount) {
			return saveSynapse(neuronRep, synapseCount, synapse);
		});
	});
}
var saveSynapse = function(neuron, synapseCount, synapse) {
	console.log("saving synapse");
	return new rsvp.Promise(function(resolve, reject) {
		var synapseEntry = new Synapse({
			senderNeuronId: neuron.neuronId,
			receiverIndex: synapseCount,
			weight: synapse
		});
		synapseEntry.save(function(err, record) {
			if(err) { reject(this); }
			else {
				console.log(record);
				resolve(record);
			}
		});
	});
}
exports.storeNet = function(req, res, app) {
	saveNet(req.body.generationCount)
	.then(function(netId) {
		return rsvp.Promise.all(saveNeurons(netId, req.body.layers));
	})
	.then(function(neurons) {
		return rsvp.Promise.all(saveSynapses(neurons));
	})
	.then(function(completedNet) {
		res.json({success: true});
	})
	.catch(function(error) {
		console.log(error);
	});
}
