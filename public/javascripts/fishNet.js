function d3NetDisplay(net) {
  // get the data
  var links = [];

  var visualizationModel = getModel(net);
  visualizationModel.forEach(function(layer, layerIndex) {
    layer.forEach(function(neuron, neuronIndex) {
      neuron.outgoingEdges.forEach(function(edge, edgeIndex) {
        console.log(edge);
        links.push({source: edge.source.id, target: edge.target.id});
      });
    });
  });

  console.log(links);
  displayNet(links);
}
function getModel(representation) {
  var intermediateNetModel = [];
  representation.forEach(function(layer, layerIndex) {
    var layerModel = getLayerModel(layer, layerIndex);
    intermediateNetModel.push(layerModel);
  });
  // We are not interested in the final layer
  for(var i = 0; i < intermediateNetModel.length; i++) {
    intermediateNetModel[i].forEach(function(neuronModel, neuronIndex) {
      neuronModel.outgoingEdges = getEdgeMapping(
        neuronModel.synapses,
        neuronModel.node,
        intermediateNetModel[i + 1]
      );
    });
  }
  return intermediateNetModel;
}
function getLayerModel(layer, layerIndex) {
  var layerModel = [];
  layer.forEach(function(neuron, neuronIndex) {
    var neuronId = layerIndex + "-" + neuronIndex;
    var nodeModel = {id: neuronId};
    layerModel.push({node: nodeModel, synapses: neuron});
  });
  return layerModel;
}
function getEdgeMapping(synapses, neuronModel, nextLayer) {
  var edgeMapping = [];
  synapses.forEach(function(synapse, synapseIndex) {
    edgeMapping.push({source: neuronModel, target: nextLayer[synapseIndex].node, value: 5});
  });
  return edgeMapping;
}
function displayNet(links) {
  var nodes = {};

  // Compute the distinct nodes from the links.
  links.forEach(function(link) {
    link.source = nodes[link.source] ||
        (nodes[link.source] = {name: link.source});
    link.target = nodes[link.target] ||
        (nodes[link.target] = {name: link.target});
    link.value = +link.value;
  });

  var width = 600,
      height = 300;

  var force = d3.layout.force()
      .nodes(d3.values(nodes))
      .links(links)
      .size([width, height])
      .linkDistance(60)
      .charge(-300)
      .on("tick", tick)
      .start();

  var svg = d3.select("#net").append("svg")
      .attr("width", width)
      .attr("height", height);

  // build the arrow.
  svg.append("svg:defs").selectAll("marker")
      .data(["end"])      // Different link/path types can be defined here
    .enter().append("svg:marker")    // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
    .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

  // add the links and the arrows
  var path = svg.append("svg:g").selectAll("path")
      .data(force.links())
    .enter().append("svg:path")
  //    .attr("class", function(d) { return "link " + d.type; })
      .attr("class", "link")
      .attr("marker-end", "url(#end)");

  // define the nodes
  var node = svg.selectAll(".node")
      .data(force.nodes())
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  // add the nodes
  node.append("circle")
      .attr("r", 5);

  // add the text
  node.append("text")
      .attr("x", 12)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

  // add the curvy lines
  function tick() {
      path.attr("d", function(d) {
          var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = Math.sqrt(dx * dx + dy * dy);
          return "M" +
              d.source.x + "," +
              d.source.y + "A" +
              dr + "," + dr + " 0 0,1 " +
              d.target.x + "," +
              d.target.y;
      });

      node
          .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; });
  }
}
