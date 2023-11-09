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
          parents: unpack(regionRows, 'parent'),
          marker: {
              colorscale: 'Blues', 
              colorbar: {
                  tickvals: [0, 1, 2, 3, 4], 
                  ticktext: ['Central', 'Southern', 'Northern', 'Western', 'Eastern'], 
              }
          }
      }];

      Plotly.newPlot(divId, data);
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
