var container_parent = $('.display') ,
    chart_container = $('#map'),
    margins = {top: 0, right: 20, bottom: 20, left: 20},
    width = container_parent.width(),
    height = (width * .6),
    vis, vis_group, aspect

var defaults = {
    land: {
        fill: '#baba71',
        stroke: '#61613b',
        strokeWidth: .5
    },
    states: {
        fill: '#baba71',
        stroke: '#535332',
        strokeWidth: .5
    },
    districts: {
        fill: 'none',
        stroke: '#fff',
        strokeWidth: .5
    }
}

var projection = d3.geoAlbersUsa()
    .scale(width)
    .translate([ width/2, height/2 ]);

var path = d3.geoPath()
    .projection(projection);

vis = d3.select('#map').append('svg')
    .attrs({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

d3.queue()
    .defer(d3.json, 'data/us.json')
    .defer(d3.json, 'data/us-congress-113.json')
    .await(ready);

function ready(error, topology, congress) {
    if (error) return console.error(error);

    var geometryCollection = congress.objects.districts,
        featureCollection = topojson.feature(congress, geometryCollection),
        features = featureCollection.features,
        neighbors = topojson.neighbors(geometryCollection.geometries);


    features.forEach(function(feature, i) {
        feature.centroid = path.centroid(feature);
        if (feature.centroid.some(isNaN)) feature.centroid = null; // off the map
        feature.neighbors = feature.centroid ? neighbors[i]
            .filter(function(j) {
                return j < i && features[j].centroid;
            })
            .map(function(j) {
                return features[j];
            }) : [];
    });


    // draw the US boundaries
    vis_group.append('path')
        .datum(topojson.feature(topology, topology.objects.land))
        .attrs({
            'd': path,
            'fill': defaults.land.fill,
            'stroke': defaults.land.stroke,
            'stroke-width': defaults.land.strokeWidth
        })

    vis_group.append('path')
        .datum(topojson.mesh(congress, geometryCollection, function(a, b) {
            return a !== b
        }))
        .attrs({
            'd': path,
            'fill': 'none',
            'stroke': defaults.districts.stroke,
            'stroke-width': defaults.districts.strokeWidth
        })


    // draws the state outlines
    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.states, function(a, b){
            return a !== b
        }))
        .attrs({
            'd': path,
            'fill': 'none',
            'stroke': defaults.states.stroke
        })
}


$(window).on('resize', function() {
    var targetWidth = container_parent.width()
    vis.attrs({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})