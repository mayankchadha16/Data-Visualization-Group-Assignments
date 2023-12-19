/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var shp = ee.FeatureCollection("projects/ee-chadhamayank1609/assets/Ban_Parks_10hectares");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Shape file of Bnagalore parks >10 hectares
var bangalore = ee.FeatureCollection(shp); 

Map.addLayer(bangalore, {}, 'Bangalore Parks');

var start_date = '2023-01-01';
var end_date = '2023-12-31'; 

var map = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate(start_date, end_date)
    .filterBounds(bangalore);

function maskL8sr(image) {
    var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
    var saturationMask = image.select('QA_RADSAT').eq(0);
    var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
    var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);

    return image.addBands(opticalBands, null, true)
        .addBands(thermalBands, null, true)
        .updateMask(qaMask)
        .updateMask(saturationMask);
}

map = map.map(maskL8sr);

var months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

var monthlyMeans = ee.ImageCollection([]);

// Calculate the full LST
var lst_full = map.select(['ST_B10'], ['LST']).map(function (image) {
    return image.subtract(273.16).copyProperties(image, image.propertyNames());
});

for (var i = 0; i < months.length; i++) {
    var month = months[i];
    var startDate = '2023-' + month + '-01';
    var endDate = '2023-' + month + '-' + getLastDayOfMonth(2023, parseInt(month));
    
    var monthlyMean = lst_full
        .filter(ee.Filter.date(startDate, endDate))
        .mean()
        .set('month', month);
    
    monthlyMeans = monthlyMeans.merge(monthlyMean);
}

monthlyMeans = ee.ImageCollection(monthlyMeans);
monthlyMeans = monthlyMeans.map(function(image) {
  return image.clip(bangalore)
    .set('name', 'LST_Bangalore_' + image.get('month'));
});

var palette = ['blue', 'green', 'yellow', 'orange', 'red'];

Map.addLayer(monthlyMeans, {min: 20, max: 55, palette: palette}, 'Monthly LST Bangalore');

var bufferDistance = 500; // adjustable

var buffer = bangalore.geometry().buffer(bufferDistance);

monthlyMeans = monthlyMeans.map(function(image) {
  var avgLST = image.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: buffer,
    scale: 30, // Adjustable
    maxPixels: 1e9
  });
  
  return image.set('average_LST', avgLST);
});

var monthlyMeansInfo = monthlyMeans.getInfo();

for (var i = 0; i < months.length; i++) {
    var month = months[i];
    var avgLST = monthlyMeansInfo.features[i].properties.average_LST;
    var avgLSTValue = avgLST ? avgLST.LST : 'No data available';
    print('Average LST for ' + month + ':', avgLSTValue);
}

Map.addLayer(monthlyMeans, {min: 20, max: 55, palette: palette}, 'Monthly LST Bangalore');

Map.addLayer(buffer, {color: 'red'}, 'Buffer around Bangalore Parks');

function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
