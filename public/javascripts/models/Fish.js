var Fish = function() {
	this.net = new Net([8,2]);
	this.circle = new createjs.Shape();
}
/**
 * Creates a baby fish, so cute
 * Requires male and female parents have the same number of edges in their nets.
 * @param male parent
 * 		An object of type Fish.
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
	
	if(joinedChromosome.length !== fatherChromosome.length) {
		console.log("Joined chromosome has an incorrect size!");
	}
	
	for (var i = 0; i < joinedChromosome.length; i++) {
		if(Math.random() < getMutationRate()) {
			joinedChromosome[i] = Math.random() * 2 - 1;
		}
	}
	
	var child = new Fish();
	child.net.setChromosome(joinedChromosome);
	return child;
};
/**
 * The variance for the split.
 * @returns
 * 		An integer, x, s.t. 0<= x <= 10
 */
 function getSplitPoint(length) {
	 return Math.floor(length / 2 + ((Math.random() * 2 * length / 5) - (length / 5))); 
 }
 
/**
 * @returns
 * 		The mutation rate of the fish
 */
function getMutationRate() {
	return .05;
}