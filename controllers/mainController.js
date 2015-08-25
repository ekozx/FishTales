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

/**
* Saves a neural net into mongodb within a promise.
* @param generation
*		The generation of the neural network that was saved.
* @returns
* 	A promise containing the object id of the neural network
*		to be used in any neurons that need a reference to it.
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
/**
* Saves multiple layers of promises by first saving the neuron, then
*	squashing them into a single array.
* @param netId
*		The mongodb object id for the net record
*	@param layers
*		An array of arrays of integers
* @returns
*		An array of promises, each containing a neuron representation.
*/
var saveNeurons = function(netId, layers) {
	return layers.map(function(layer, layerCount) {
		return layer.map(function(neuron, neuronCount) {
			return saveNeuron(neuron, netId, layerCount);
		});
	}).reduce(function(curArr, nextArr) {
		return curArr.concat(nextArr);
	});
}
/**
*	Saves a neuron into mongodb using a promise.
* @param neuron
*		An array of integers, each integer is an edge (i.e. synapse).
*	@param netId
*		The object id for the net the neuron will belong to.
*	@param layerCount
*		The particular layer of the net this neuron belongs to.
*	@returns
*		A promise containing a neuron representation as an object.
*/
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
/**
* Saves a synapses in mongodb within a promise.
*	@param neurons
*		An object containing an array of integers (synapses)
*	@returns
*		An array of promises
*/
var saveSynapses = function(neurons) {
	return neurons.map(function(neuronRep, layerCount) {
		return neuronRep.synapses.map(function(synapse, synapseCount) {
			return saveSynapse(neuronRep, synapseCount, synapse);
		});
	});
}
/**
* Saves a synapse into the mongodb table
*	@param neuron
*		The neuron object containing its object id for the record, the database
*		record itself, and the synapse array
*	@param synapseCount
*		An integer representing index of the synapse in the next layer
*		it is connecting to
*	@param synapse
*		An integer representing the value on the synapse (edge)
* @returns
*		A promise containing the created record (nothing is done with it)
*/
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
