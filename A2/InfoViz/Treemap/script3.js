d3.csv("model1.csv").then(function (dataRows) {
    function extractData(rows, key) {
        return rows.map(function (row) {
            return row[key];
        });
    }

    const colorPalette = d3.scaleOrdinal(d3.schemeTableau10);

    const svgWidth = 1500;
    const svgHeight = 700;

    const treemapLayout = d3
        .treemap()
        .tile(d3.treemapSquarify) // d3.treemapSlice,  d3.treemapDice and other can be tried
        .size([svgWidth, svgHeight]);

    const treemapData = {
        name: "Root",
        children: extractData(dataRows, "name").map((label, i) => ({
            name: label,
            value: parseFloat(extractData(dataRows, "value")[i]),
            parent: extractData(dataRows, "parent")[i],
        })),
    };

    const hierarchy = d3.hierarchy(treemapData).sum((d) => d.value);

    treemapLayout(hierarchy);

    const uniqueParents = Array.from(
        new Set(extractData(dataRows, "parent"))
    );
    const parentColorMap = {};
    uniqueParents.forEach((parent, i) => {
        parentColorMap[parent] = colorPalette(i);
    });

    const svgContainer = d3
        .select("#treemap")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    const cells = svgContainer
        .selectAll(".cell")
        .data(hierarchy.leaves())
        .enter()
        .append("foreignObject")
        .attr("class", "cell")
        .attr("x", (d) => d.x0)
        .attr("y", (d) => d.y0)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .style("background-color", (d) => parentColorMap[d.data.parent])
        .on("mouseover", function (event, d) {
            d3.select(this).style("border", "1px solid #000");
            showTooltip(d);
        })
        .on("mouseout", function () {
            d3.select(this).style("border", "1px solid #fff");
            hideTooltip();
        });

    cells
        .append("xhtml:div")
        .attr("class", "cell-text")
        .style("width", "100%")
        .style("height", "100%")
        .style("font-size", function (d) {
            const fontSize = Math.max(
                Math.min(30, (d.x1 - d.x0) / 2, (d.y1 - d.y0) / 2),
                8
            );
            return `${fontSize}px`;
        })
        .html(
            (d) =>
                `${d.data.name}<br>${d.value} (${(
                    (d.value / hierarchy.value) *
                    100
                ).toFixed(2)}%)`
        );

    const legendContainer = d3.select("#legend").append("div");

    const legendItems = legendContainer
        .selectAll(".legend-item")
        .data(uniqueParents)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .on("click", function (event, d) {
            filterByParent(d);
        });

    legendItems
        .append("div")
        .attr("class", "legend-color")
        .style("background-color", (d) => parentColorMap[d]);

    legendItems.append("div").text((d) => d);
});
