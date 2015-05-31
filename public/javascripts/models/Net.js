/**
 * NOTE: this is a beta net, I haven't tested it yet
 */

/**
 * A class for a basic neural network.
 * @param topology
 * 		An array of integers
 */
 var Net = function(topology) {
	 this.numLayers = topology.length;
	 this.layers = createLayers(topology);
 };
/**
 * Generate each layer for the neural network, populating with regular neurons 
 * and a bias neuron at the end. 
 * @param topology
 * 		An array of integers
 * @returns
 * 		A list of lists of type Neuron
 */
 function createLayers(topology) {
	 var layers = [];
	 for (var index = 0; index < topology.length; index++) {
		 var layer = [];
		 layers.push(layer);
		 var numOutputs = (index == topology.length - 1) ? 0 : topology[index  + 1];
		 for (var neuronNum = 0; neuronNum <= topology[index]; neuronNum++) {
			 layers[lastIndex(layers)].push(new Neuron(numOutputs, neuronNum));
		 }
		 //The bias neuron
		 layers[lastIndex(layers)][layers[lastIndex(layers)].length - 1].outputVal = 1.0;
	 }

	 return layers;
 }
 /**
  * Retruns the result values from the last neurons after calling feedForward.
  * @returns
  * 	An array of floats for the results the network
  */
 Net.prototype.getResults = function() {
	 var resultVals = [];
	 for (var index = 0; index < this.layers[this.layers.length -1].length; index++) {
		 resultVals.push(this.layers[lastIndex(this.layers)][index].outputVal);
	 }
	 return resultVals;
 };
 /**
  * Feeds the inputVals into the initial layer of neurons, 
  * then uses those initial values to populate outputvals the rest of 
  * the neurons in the network.
  * @param inputVals
  * 	An array of floats
  */
  Net.prototype.feedForward = function(inputVals) {
	  if(inputVals.length !== this.layers[0].length-1) {
		  console.log("Incorrect number of inputs for the first network layer!");
		  console.log("Expect incorrect output!");
	  }
	  for (var i = 0; i < inputVals.length; i++) { // populate the first layer
		  this.layers[0][i].outputVal = inputVals[i];
	  }
	  // loop through each layer but the first, using the previous layer to get
	  // output values for each of the present layers neurons with feedFoward.
	  for (var layerNum = 1; layerNum < this.layers.length; layerNum++) {
		  var prevLayer = this.layers[layerNum - 1];
		  for (var j = 0; j < this.layers[layerNum].length - 1; j++) {
			  this.layers[layerNum][j].feedForward(prevLayer);
		  }
	  }
  };
 /**
  * A small helper function for less lengthy code
  */
function lastIndex(layers) {
   return layers.length - 1;
}
