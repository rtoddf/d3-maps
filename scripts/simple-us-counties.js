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
        stroke: '#61613b',
        strokeWidth: .5
    },
    counties: {
        fill: '#baba71',
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

d3.json('data/us.json', function(error, topology){
    // draw the US boundaries
    vis_group.append('path')
        .datum(topojson.feature(topology, topology.objects.land))
        .attrs({
            'd': path,
            'fill': defaults.land.fill,
            'stroke': defaults.land.stroke,
            'stroke-width': defaults.land.strokeWidth
        })

    // draws the state outlines
    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.states, function(a, b){
            return a !== b
        }))
        .attrs({
            'd': path,
            'fill': 'none',
            'stroke': defaults.states.stroke,
        })

    // draws the county borders
    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.counties, function(a, b){
            return a !== b && !(a.id / 1000 ^ b.id / 1000)
        }))
        .attrs({
            'd': path,
            'fill': 'none',
            'stroke': defaults.counties.stroke,
            'stroke-width': defaults.counties.strokeWidth
        })
})


$(window).on('resize', function() {
    var targetWidth = container_parent.width()
    vis.attrs({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})