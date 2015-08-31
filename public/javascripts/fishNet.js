var width = 400,
    height = 200;

var color = d3.scale.category10();

var nodes = [],
    links = [];

var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .charge(-300)
    .linkDistance(100)
    .size([width, height])
    .on("tick", tick)
    .gravity(.5);

var svg = d3.select("#net").append("svg")
    .attr("width", width)
    .attr("height", height);

var marker = svg.append("defs").append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
     .append("path")
        .attr("d", "M0,-5L10,0L0,5");

var node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

function startDisplay() {
  link = link.data(force.links(), function(d) {
    return d.source.id + "-" + d.target.id;
  });
  link.enter().append("path")
    .attr("class", "link")
    .style("stroke", function (d) {
        return d3.rgb(5*d.value, 200+d.value, 127-2*d.value);
     })
    .attr("marker-end", "url(#arrow)");
  link.enter().insert("line", ".node").attr("class", "link");
  link.exit().remove();

  node = node.data(force.nodes(), function(d) { return d.id;});
  node.enter()
  .append("circle")
  .attr("class", function(d) {
    return "node " + d.id;
  })
  .attr("r", 8);


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
  console.log(netModel);
  netModel.forEach(function(layer, layerIndex) {
    layer.forEach( function(neuron, neuronIndex) {
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
