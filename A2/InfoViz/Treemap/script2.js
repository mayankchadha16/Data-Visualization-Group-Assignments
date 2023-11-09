d3.csv('make.csv', function(err, rows){
  function unpack(rows, key) {
  return rows.map(function(row) { return row[key]});
}

var data = [{
      type: "treemap",
      ids: unpack(rows, 'name'),
      values: unpack(rows, 'value'),
      labels: unpack(rows, 'name'),
      parents: unpack(rows, 'parent')
    }];

Plotly.newPlot('myDiv', data);
})
