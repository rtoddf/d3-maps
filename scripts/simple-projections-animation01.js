var container_parent = $('.display') ,
    chart_container = $('#map'),
    margins = {top: 20, right: 20, bottom: 20, left: 20},
    width = container_parent.width() - margins.left - margins.right,
    height = width,
    vis, vis_group, aspect,
    translate = [ width/2, height/2 ]

var defaults = {
    path: {
        fill: 'none',
        stroke: '#666',
        strokeWidth: 2,
        strokeLinejoin: 'round'
    },
    graticule: {
        stroke: '#999',
        strokeWidth: 1,
    },
    equator: {
        stroke: 'rgba(0,50,100,1)',
        strokeWidth: 1,
    },
    colors: {
        none: 'none',
        land: '#baba71',
        water: 'rgba(87,146,174,.5)',
        stroke: '#333',
        strokeWidth: .5,
        strokeOpacity: .5
    }
}

var rotate = [ 10, -10 ],
    velocity = [ .010, 0 ],
    // velocity = [ .010, -.010 ],
    time = Date.now(),
    coordinates = [ [-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0] ]

var projection = d3.geo.orthographic()
    .scale(255)
    .translate([ width / 2, height / 2 ])
    .clipAngle(90)
    .precision(.1)

    // .scale(255)
    // .rotate([-270, 0])
    // .translate(translate)
    // .clipAngle(90)
    // .precision(.1)

var path = d3.geo.path()
    .projection(projection)

var graticule = d3.geo.graticule()

vis = d3.select('#map').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

d3.json('data/world-50m.json', function(error, topology){
    var countries = topojson.feature(topology, topology.objects.countries).features

    vis_group.append('path')
        .datum({
            type: 'Sphere'
        })
        .attr({
            'd': path,
            'fill': defaults.colors.water,
            'stroke': defaults.path.stroke,
            'stroke-width': defaults.path.strokeWidth,
            'stroke-linejoin': defaults.path.strokeLinejoin
        })

    vis_group.selectAll('path')
        .data(countries)
            .enter().append('path')
        .attr({
            'd': path,
            'fill': defaults.colors.land
        })

    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.countries), function(a, b){
            return a !== b
        })
        .attr({
            'd': path,
            'stroke': defaults.colors.stroke,
            'stroke-width': defaults.colors.strokeWidth,
            'fill': defaults.colors.none
        })

    vis_group.append('path')
            .datum(graticule)
        .attr({
            'd': path,
            'fill': defaults.colors.none,
            'stroke': defaults.colors.stroke,
            'stroke-width': defaults.colors.strokeWidth,
            'stroke-opacity': defaults.colors.strokeOpacity
        })

    vis_group.append('path')
        .datum({
            type: 'LineString',
            coordinates: coordinates
        })
        .attr({
            'd': path,
            'fill': defaults.path.fill,
            'stroke': defaults.equator.stroke,
            'stroke-width': defaults.path.strokeWidth,
            'stroke-linejoin': defaults.path.strokeLinejoin
        })

    var feature = vis_group.selectAll('path')

    d3.timer(function(){
        var dt = Date.now() - time
        projection.rotate([ rotate[0] + velocity[0] * dt, rotate[1] + velocity[1] * dt ])
        feature.attr({
            'd': path
        })
    })
})

$(window).on('resize', function() {
    var targetWidth = container_parent.width()
    vis.attr({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})
