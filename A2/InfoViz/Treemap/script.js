var margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 1600 - margin.left - margin.right,
  height = 850 - margin.top - margin.bottom;

var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("make.csv", function (data) {
  var root = d3
    .stratify()
    .id(function (d) {return d.name;})
    .parentId(function (d) {return d.parent;})(data);

  root.sum(function (d) {return +d.value;});

  d3.treemap().size([width, height]).padding(4)(root); // default d3.treemapSquarify
//   d3.treemap().size([width, height]).tile(d3.treemapSlice).padding(4)(root);
//   d3.treemap().size([width, height]).tile(d3.treemapDice).padding(4)(root);

  var leaves = root.leaves();

  // Add rectangles and text labels
  var rects = svg
    .selectAll("rect")
    .data(leaves)
    .enter()
    .append("rect")
    .attr("x", function (d) {return d.x0;})
    .attr("y", function (d) {return d.y0;})
    .attr("width", function (d) {return d.x1 - d.x0;})
    .attr("height", function (d) {return d.y1 - d.y0;})
    .style("stroke", "black")
    .style("fill", "#69b3a2");

  var fontScale = d3
    .scaleLinear()
    .domain([0,d3.max(leaves, function (d) {return d.x1 - d.x0;}),])
    .range([5, 30]);

  var textLabels = svg
    .selectAll("text")
    .data(leaves)
    .enter()
    .append("text")
    .attr("x", function (d) {return (d.x0 + d.x1) / 2;})
    .attr("y", function (d) {return (d.y0 + d.y1) / 2;})
    .text(function (d) {return d.data.name;})
    .attr("font-size", function (d) {return fontScale(d.x1 - d.x0) + "px";})
    .attr("fill", "white")
    .style("visibility", "hidden")
    .attr("text-anchor", "middle") // Center align text horizontally
    .attr("dominant-baseline", "middle"); // Center align text vertically

  // Add hover event listeners
  rects
  .on("mouseover", function (d) {
    d3.select(this).style("opacity", 0.7);
    var rectIndex = rects.nodes().indexOf(this);
    var textLabel = d3.select(textLabels.nodes()[rectIndex]);

    textLabel.style("visibility", "visible");
    var percentOfTotal = ((d.data.value / d.parent.value) * 100).toFixed(2); // Calculate percent of total
    textLabel.text(`${d.data.name}: ${percentOfTotal}% (${d.data.value})`); // Display name, percent, and value
  })
  .on("mouseout", function () {
    d3.select(this).style("opacity", 1);
    var rectIndex = rects.nodes().indexOf(this);
    var textLabel = d3.select(textLabels.nodes()[rectIndex]);
    textLabel.style("visibility", "hidden");
    textLabel.text(d.data.name); // Reset the label text to just the name
  });
});
