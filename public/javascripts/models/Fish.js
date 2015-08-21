var Fish = function() {
  this.net = new Net([4,6,1]);
  this.circle = new createjs.Shape();
  this.tick = 0;
  this.fitness = 0;
  this.dead=0;
  this.hunger=100;
}

/**
* @returns
*   A representation of the Net object as a plain javascript object
*   with a generation property and a neurons property. Neurons is
*   returned as a list of lists, each of which is an edge weight.
*/
Fish.prototype.getRepresentation = function (generation) {
  var plainRepresentation = {generationCount: generation};
  plainRepresentation.neurons = this.net.getRepresentation();
  // this.net.layers.forEach(function(neuron, index, neurons) {
  //   console.log(neuron);
  // });
  return plainRepresentation;
}

/**
 * Creates a baby fish, so cute
 * Requires male and female parents have the same number of edges in their nets.
 * @param male parent
 *     An object of type Fish.
 */
Fish.prototype.makeChild = function (maleParent) {
  var motherChromosome = this.net.getChromosome();
  var fatherChromosome = maleParent.net.getChromosome();

  if (fatherChromosome.length !== motherChromosome.length) {
    console.log("Warning: Mother and father chromosomes are not same length!");
  }

  var splitPoint = getSplitPoint(motherChromosome.length);
  var motherSide = motherChromosome.splice(0, splitPoint);
  var fatherSide = fatherChromosome.splice(splitPoint, fatherChromosome.length);
  var joinedChromosome = motherSide.concat(fatherSide);

  for (var i = 0; i < joinedChromosome.length; i++) {
    if(Math.random() < getMutationRate()) {
      joinedChromosome[i] = Math.random() * 2 - 1;
    }
  }

  var fish = new Fish();

  fish.circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 20);

  fish.circle.x = Math.random() * w;
  fish.circle.y = Math.random() * h;


  fish.circle.velY = 5;
  fish.circle.velX = 0;

  var turn = (Math.random() * 360);
  var rad = (turn*Math.PI)/180;
  var cs = Math.cos(rad);
  var sn = Math.sin(rad);

  var px = fish.circle.velX * cs - fish.circle.velY * sn;
  var py = fish.circle.velX * sn + fish.circle.velY * cs;

  fish.circle.velX = px;
  fish.circle.velY = py;

  fish.tick=0;
  fish.fitness=0;
  fish.dead=0;
  fish.hunder=100;

  fish.net.setChromosome(joinedChromosome);
  return fish;
};
/**
 * The variance for the split.
 * @returns
 *     An integer, x, s.t. 0<= x <= 10
 */
 function getSplitPoint(length) {
   return Math.floor(length / 2 + ((Math.random() * 2 * length / 5) - (length / 5)));
 }

/**
 * @returns
 *     The mutation rate of the fish
 */
function getMutationRate() {
  return .06;
}
