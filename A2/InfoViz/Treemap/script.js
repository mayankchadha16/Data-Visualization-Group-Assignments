const width = 800;
const height = 600;

const svg = d3.select("#treemap")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");
    
const format = d3.format(",d");

d3.csv("make.csv").then(data => {
    const color = d3.scaleOrdinal(data.map(d => d.name), d3.schemeTableau10);
    const root = d3.hierarchy({ children: data })
        .sum(d => +d.counts);

    const treemap = d3.treemap()
        .size([width, height])
        .tile(d3.treemapSquarify)
        .padding(1)
        .round(true);

    treemap(root);

    const cell = svg.selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    cell.append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", "steelblue")
        .append("title")
        .attr("fill-opacity", 0.6)
        .text(d => `${d.data.Make}: ${d.data.counts}`);

    // cell.append("rect")
    //     .attr("id", d => (d.leafUid = `leaf-${d.data.Make.split(' ').join('_')}`))
    //     .attr("fill", d => {
    //         while (d.depth > 1) d = d.parent;
    //         return color(d.data.Make);
    //     })
    //     .attr("fill-opacity", 0.6)
    //     .attr("width", d => d.x1 - d.x0)
    //     .attr("height", d => d.y1 - d.y0);

    cell.append("text")
        .attr("clip-path", d => d.clipUid)
        .selectAll("tspan")
        .data(d => d.data.Make.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
        .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);

    cell.append("clipPath")
        .attr("id", d => (d.clipUid = `clip-${d.data.Make.split(' ').join('_')}`))
        .append("use")
        .attr("xlink:href", d => d.leafUid.href);
});