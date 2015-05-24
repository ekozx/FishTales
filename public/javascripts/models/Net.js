/**
 * A class for a basic neural network.
 * @param topology
 * 		An array of integers 
 */
 var Net = function(topology) {
	 this.numLayers = topology.length;
	 this.layers = createLayers(this.numLayers, topology);
 };
/**
 * @param topology
 * 		An array of integers 
 * @returns
 * 		A list of lists of type Neuron
 */ 
 function createLayers(topology) {
	 var layers = [];
	 for (var index = 0; index < topology.length; index++) {
		 var layer = [];
		 var numOutputs = (index == topology.length - 1) ? 0 : topology[index  + 1];
		 for (var neuronNum = 0; neuronNum < topology.length; neuronNum++) {
			 layers[layers.length - 1].push(new Neuron(numOutputs, neuronNum));
		 }
		 layers.push(layer);
		 //a little confused about this line
		 layers[layers.length - 1][layers[layers.length - 1].length - 1] = 1.0;
	 }
	 return layers;
 }
 /**
  * @returns
  * 	An arary of floats for the results the network
  */
 Net.prototype.getResults = function() {
	 var resultVals = [];
	 for (var index = 0; index < this.layers[this.layers.length -1].length; index++) {
		 resultVals.push(this.layers[this.layers.length - 1][index].outputVal);
	 }
 };
 /**
  * @param inputVals
  * 	An array of floats 
  */
  Net.prototype.feedForward = function(inputVals) {
	  for (var i = 0; i < inputVals.length; i++) {
		  this.layers[0][i].outputVal = inputVals[i];
	  }
	  for (var layerNum = 0; layerNum < this.layers.length; layerNum++) {
		  var prevLayer = this.layers[layerNum - 1];
		  for (var j = 0; j < array.length; j++) {
			  this.layers[layerNum][j].feedFoward(prevLayer);
		  }
	  }
  };