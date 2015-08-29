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
    var edgeMapping = getEdgeMapping(neuron, neuronId, layerIndex);
    layerModel.push({
      nodeModel: {id: neuronId},
      edgeModel: edgeMapping
    });
  });
  return layerModel;
}
function getEdgeMapping(synapses, neuronId, layerIndex) {
  var edgeMapping = [];
  synapses.forEach(function(synapse, synapseIndex) {
    var nextLayerNeuronId = (layerIndex + 1) + "-" + synapseIndex;
    edgeMapping.push({source: neuronId, target: nextLayerNeuronId});
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
      nodes.push(neuron.nodeModel);
      neuron.edgeModel.forEach(function(edge, edgeIndex) {
        links.push({source: edge.source, target: edge.target});
      });
    });
  });
}
function getModel(representation) {
  var netModel = [];
  representation.forEach(function(layer, layerIndex) {
    var layerModel = getLayerModel(layer, layerIndex);
    netModel.push(layerModel);
  });
  return netModel;
}
function tick() {
  node.attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })

  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
}
