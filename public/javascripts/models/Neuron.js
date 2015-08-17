/**
 * A class for a basic neuron within a Net.
 * @param numOutputs
 *     Integer for the total number of edges the neuron connects to
 *     in the next layer.
 * @param index
 * @param connections
 *     Array of integers for the weights of the edges
 */
var Neuron = function(numOutputs, index) {
  this.eta = 0.39; // Overall net learning rate
  this.alpha = 0.1; //momentum, multiplied by last delta weight
  this.numOutputs = numOutputs;
  this.index = index;
  this.connectionWeights = buildConnections(numOutputs);

  this.outputVal = 0.0;
  this.inputVal = 0.0;
  this.gradient = 0.0;
};
/**
 * @param numOutputs
 *     The number of outputs
 * @returns
 *     Array of integers for the weights of each connection.
 */
function buildConnections(numOutputs) {
  var connections = [];
  for (var index = 0; index < numOutputs; index++) {
    connections.push((Math.random() * 2) - 1);
    //connections.push(.1);
  }
  return connections;
}
/**
 * Sets the edge weights for each connection on the neuron.
 * @param weights
 *     an array of flaots for the weights to set
 */
 Neuron.prototype.setWeights = function(weights) {

 };
/**
 * @param x
 *     The input for the hyperbolic tangent function.
 * @returns
 *     The output of the hyperbolic tangent function.
 */
 function transferFunction(x) {
   return Math.tanh(x);
 }
 /**
  * Loops through all previous layers ouputs and sum their outputValue (s)
  * times their weight (s), updating the output value of this neuron.
  * @param prevLayer
  *   Array of Neurons from previous layer.
  */
 Neuron.prototype.feedForward = function(prevLayer) {
    var sum = 0.0;
    for (var index = 0; index < prevLayer.length; index++) {
      sum += prevLayer[index].outputVal *
          prevLayer[index].connectionWeights[this.index];
    }
    //console.log(sum);
    sum/=(prevLayer.length/2.0);
    //console.log(sum);
    this.outputVal = transferFunction(sum);
  }
