d3.csv('model.csv', function (err, rows) {
    function unpack(rows, key) {
        return rows.map(function (row) {
            return row[key];
        });
    }

    function createTreemap(divId, regionRows, region) {
        var data = [{
            type: "treemap",
            ids: unpack(regionRows, 'name'),
            values: unpack(regionRows, 'value'),
            labels: unpack(regionRows, 'name'),
            textinfo: "label+value",
            hoverinfo: "all",
            parents: unpack(regionRows, 'parent'),
            marker: {
                colorscale: [
                    [0, 'rgb(235,241,248)'],
                    [1, 'rgb(8,48,107)']
                ],
                colorbar: {
                    tickvals: [0, 1, 2, 3, 4],
                    ticktext: ['Central', 'Southern', 'Northern', 'Western', 'Eastern'],
                    title: 'Region'
                }
            },
            tiling: {
                packing: 'squarify', // can be set to one of ( "squarify" | "binary" | "dice" | "slice" | "slice-dice" | "dice-slice" ) most of them look same though
                pad: 8
            }
        }];

        var layout = {
            title: {
                text: "Number of EVs in " + region + " Region",
                font: {
                    family: 'Arial, sans-serif',
                    size: 20,
                    color: '#333',
                    weight: 'bolder' 
                }
            },
            xaxis: { title: 'X Axis Label' },
            yaxis: { title: 'Y Axis Label' },
            showlegend: true,
            responsive: true
        };

        Plotly.newPlot(divId, data, layout);
    }

    var centralRows = rows.filter(function (row) {
        return row.parent === 'Central';
    });

    var easternRows = rows.filter(function (row) {
        return row.parent === 'Eastern';
    });

    var northernRows = rows.filter(function (row) {
        return row.parent === 'Northern';
    });

    var southernRows = rows.filter(function (row) {
        return row.parent === 'Southern';
    });

    var westernRows = rows.filter(function (row) {
        return row.parent === 'Western';
    });

    createTreemap('centralDiv', centralRows, 'Central');
    createTreemap('easternDiv', easternRows, 'Eastern');
    createTreemap('northernDiv', northernRows, 'Northern');
    createTreemap('southernDiv', southernRows, 'Southern');
    createTreemap('westernDiv', westernRows, 'Western');
});
