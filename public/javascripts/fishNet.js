var width = 400,
    height = 200;

var color = d3.scale.category10();

var nodes = [],
    links = [];

var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .charge(-200)
    .linkDistance(60)
    .size([width, height])
    .on("tick", tick);

var svg = d3.select("#net").append("svg")
    .attr("width", width)
    .attr("height", height);

var node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

function startDisplay() {
  link = link.data(force.links(), function(d) {
    return d.source.id + "-" + d.target.id;
  });
  link.enter().insert("line", ".node").attr("class", "link");
  link.exit().remove();

  node = node.data(force.nodes(), function(d) { return d.id;});
  node.enter().append("circle").attr("class", function(d) {
    return "node " + d.id;
  }).attr("r", 8);
  node.exit().remove();

  force.start();
}

function d3NetDisplay(net) {
  var visualizationModel = getModel(net);
  displayNodes(visualizationModel);

  startDisplay();
}
function getLayerModel(layer, layerIndex) {
  var layerModel = [];
  layer.forEach(function(neuron, neuronIndex) {
    var neuronId = layerIndex + "-" + neuronIndex;
    var nodeModel = {id: neuronId};
    layerModel.push({node: nodeModel, synapses: neuron});
  });
  // layer.forEach(function(neuron, neuronIndex) {
  //   var neuronId = layerIndex + "-" + neuronIndex;
  //   var model = {id: neuronId};
  //   var edgeMapping = getEdgeMapping(neuron, model, layerIndex);
  //   layerModel.push({
  //     nodeModel: model,
  //     edgeModel: edgeMapping
  //   });
  // });
  return layerModel;
}
function getEdgeMapping(synapses, neuronModel, nextLayer) {
  var edgeMapping = [];
  synapses.forEach(function(synapse, synapseIndex) {
    edgeMapping.push({source: neuronModel, target: nextLayer[synapseIndex].node});
  });
  return edgeMapping;
}
function displayNodes(netModel) {
  // var a = {id: "a"}, b = {id: "b"}, c = {id: "c"};
  // nodes.push(a, b, c);
  // links.push({source: a, target: b},
  // {source: a, target: c}, {source: b, target: c});
  netModel.forEach(function(layer, layerIndex) {
    layer.forEach( function(neuron, neuronIndex) {
      console.log(neuron);
      nodes.push(neuron.node);
      neuron.outgoingEdges.forEach(function(edge, edgeIndex) {
        links.push(edge);
      });
    });
  });
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
  console.log(intermediateNetModel);
  return intermediateNetModel;
}
function tick() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
}
