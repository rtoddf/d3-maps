var container_parent = $('.display') ,
	chart_container = $('#map'),
	margins = {top: 0, right: 0, bottom: 0, left: 0},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .8) - margins.top - margins.bottom,
	vis, vis_group, aspect

var defaults = {
    colors: {
        none: 'none',
        land: '#6e8953',
        water: '#a8e1f8',
        stroke: '#333',
        strokeWidth: .25,
        strokeOpacity: .5
    }
}

var projection = d3.geoMercator()
	.scale((width + 1) / 2 / Math.PI)
	.translate([ width / 2, height / 2 ])
	.precision(.1)

var path = d3.geoPath()
	.projection(projection)

var graticule = d3.geoGraticule()

vis = d3.select('#map').append('svg')
	.attrs({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
	.attrs({
		'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	})

aspect = chart_container.width() / chart_container.height()

vis_group.append('rect')
	.attrs({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'fill': 'rgba(87,146,174,.5)'
	})

vis_group.append('path')
	.datum(graticule)
	.attrs({
        'd': path,
        'fill': defaults.colors.none,
        'stroke': defaults.colors.stroke,
        'stroke-width': defaults.colors.strokeWidth,
        'stroke-opacity': defaults.colors.strokeOpacity
    })

d3.json('data/world-50m.json', function(error, topology){
	vis_group.append('path')
		.datum(topojson.feature(topology, topology.objects.land))
		.attrs({
			'class': 'land',
			'd': path,
			'fill': defaults.colors.land
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.countries), function(a, b){
			return a !== b
		})
		.attrs({
			'class': 'boundary',
			'd': path,
			'stroke': defaults.colors.stroke,
            'stroke-width': defaults.colors.strokeWidth,
            'fill': defaults.colors.none
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attrs({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})
