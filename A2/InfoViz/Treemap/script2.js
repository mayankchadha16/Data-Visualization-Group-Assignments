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
                    [0, 'rgb(173, 216, 230)'],
                    [1, 'rgb(0, 0, 128)']
                ],
                colorbar: {
                    tickvals: [0, 1, 2, 3, 4],
                    ticktext: ['Central', 'Southern', 'Northern', 'Western', 'Eastern'],
                    title: 'Region'
                }
            },
            tiling: {
                packing: 'squarify',
                pad: 8
            }
        }];

        var layout = {
            title: region + " Region Treemap",
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
