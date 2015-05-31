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
 * Generate the layers between
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
  * @returns
  * 	An array of floats for the results the network
  */
 Net.prototype.getResults = function() {
	 var resultVals = [];
	 for (var index = 0; index < this.layers[this.layers.length -1].length; index++) {
//		 console.log(this.layers[lastIndex(this.layers)][index].outputVal);
		 resultVals.push(this.layers[lastIndex(this.layers)][index].outputVal);
	 }
//	 console.log(resultVals);
	 return resultVals;
 };
 /**
  * @param inputVals
  * 	An array of floats
  */
  Net.prototype.feedForward = function(inputVals) {
	  for (var i = 0; i < inputVals.length; i++) {
		  this.layers[0][i].outputVal = inputVals[i];
	  }
	  for (var layerNum = 1; layerNum < this.layers.length; layerNum++) {
		  var prevLayer = this.layers[layerNum - 1];
		  for (var j = 0; j < inputVals.length - 1; j++) {
//			  console.log(this.layers[layerNum][j]);
			  this.layers[layerNum][j].feedForward(prevLayer);
		  }
	  }
  };
  /**
   * @returns
   */
   function lastIndex(layers) {
	   return layers.length - 1;
   }
